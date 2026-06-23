import { Marked, marked } from 'marked'
import { useEffect, useState } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import matter from 'gray-matter'
import styles from '../../styles/Notes.module.css'
import { pathToSlug } from '../../utils/slug'

export default function NotePage({ title, html, headings = [] }) {
    const [activeId, setActiveId] = useState('')
    const [isSidebarVisible, setIsSidebarVisible] = useState(true)

    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsSidebarVisible(false)
        }
    }, [])

    useEffect(() => {
        if (headings.length === 0) return

        const handleScroll = () => {
            const headingElements = headings
                .map((h) => document.getElementById(h.id))
                .filter(Boolean)

            let currentActive = ''
            for (const el of headingElements) {
                const rect = el.getBoundingClientRect()
                // If the heading is within 120px of the top of the viewport
                if (rect.top <= 120) {
                    currentActive = el.id
                }
            }

            if (!currentActive && headingElements.length > 0) {
                currentActive = headingElements[0].id
            }

            setActiveId(currentActive)
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll() // Initial check

        return () => window.removeEventListener('scroll', handleScroll)
    }, [headings])

    return (
        <div className={styles.noteContainer}>
            <Head>
                <title>{title}</title>
            </Head>

            <div className={styles.controls}>
                <Link href="/notes" className={styles.backLink}>
                    &larr; Back to Notes
                </Link>
            </div>

            <div
                className={`${styles.layoutWrapper} ${!isSidebarVisible ? styles.sidebarHidden : ''}`}
            >
                {headings.length > 0 && (
                    <aside className={`${styles.sidebar} ${!isSidebarVisible ? styles.sidebarCollapsed : ''}`}>
                        <div className={styles.sidebarHeader}>
                            <span className={`${styles.sidebarTitle} ${!isSidebarVisible ? styles.titleHidden : ''}`}>Outline</span>
                            <button
                                onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                                className={styles.sidebarToggleButton}
                                aria-label={
                                    isSidebarVisible ? 'Hide outline' : 'Show outline'
                                }
                            >
                                {isSidebarVisible ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.toggleIcon}>
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.toggleIcon}>
                                        <rect width="18" height="18" x="3" y="3" rx="2" className={styles.desktopOnlyIcon} />
                                        <path d="M9 3v18" className={styles.desktopOnlyIcon} />
                                        <path d="m14 9 3 3-3 3" className={styles.desktopOnlyIcon} />
                                        <polyline points="6 9 12 15 18 9" className={styles.mobileOnlyIcon} />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {isSidebarVisible && (
                            <nav className={styles.outlineNav}>
                                <ul className={styles.outlineList}>
                                    {headings.map((heading) => (
                                        <li
                                            key={heading.id}
                                            className={`${styles.outlineItem} ${styles[`depth${heading.depth}`] || ''} ${
                                                activeId === heading.id
                                                    ? styles.activeOutlineItem
                                                    : ''
                                            }`}
                                        >
                                            <a
                                                href={`#${heading.id}`}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    const el = document.getElementById(heading.id)
                                                    if (el) {
                                                        el.scrollIntoView({ behavior: 'smooth' })
                                                    }
                                                }}
                                            >
                                                {heading.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                    </aside>
                )}

                <main className={styles.mainContent}>
                    <div
                        className={styles.content}
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </main>
            </div>
        </div>
    )
}

export async function getStaticPaths() {
    return {
        paths: [], // Do not pre-render notes at build time
        fallback: 'blocking', // Generate on first request, cache subsequent requests
    }
}

export async function getStaticProps({ params }) {
    const { slug } = params // slug is an array
    const targetSlug = slug.join('/')
    const repo = 'mattdanielmurphy/personal-notes'
    const GITHUB_PAT = process.env.GITHUB_PAT

    // 1. In development, read directly from the local Obsidian vault if it exists
    const localVaultPath = '/Users/matthewmurphy/Library/Mobile Documents/iCloud~md~obsidian/Documents/Personal';
    if (process.env.NODE_ENV === 'development') {
        const fs = require('fs');
        if (fs.existsSync(localVaultPath)) {
            console.log(`Loading single note '${targetSlug}' from local Obsidian vault...`);
            const path = require('path');
            
            const getLocalFilesRecursively = (dir, fileList = []) => {
                if (!fs.existsSync(dir)) return fileList;
                const files = fs.readdirSync(dir);
                for (const file of files) {
                    if (file === '.git' || file === 'node_modules' || file === '.obsidian') continue;
                    const filePath = path.join(dir, file);
                    const stat = fs.statSync(filePath);
                    if (stat.isDirectory()) {
                        getLocalFilesRecursively(filePath, fileList);
                    } else if (file.endsWith('.md')) {
                        fileList.push(filePath);
                    }
                }
                return fileList;
            };

            const filePaths = getLocalFilesRecursively(localVaultPath);
            const matchedFilePath = filePaths.find(filePath => {
                const repoRelativePath = path.relative(localVaultPath, filePath);
                return pathToSlug(repoRelativePath) === targetSlug;
            });

            if (!matchedFilePath) {
                console.log(`Note not found in local vault for slug: ${targetSlug}`);
                return { notFound: true };
            }

            try {
                const rawContent = fs.readFileSync(matchedFilePath, 'utf8');
                const { data, content } = matter(rawContent);

                if (data.public !== true) {
                    console.log(`Note '${targetSlug}' is not public.`);
                    return { notFound: true };
                }

                // Extract headings and generate HTML with matching unique IDs
                const tempMarked = new Marked();
                const tokens = tempMarked.lexer(content);
                const headings = [];
                const ids = {};

                const getUniqueId = (text) => {
                    let id = text
                        .toLowerCase()
                        .trim()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/[\s_-]+/g, '-')
                        .replace(/^-+|-+$/g, '');
                    if (ids[id] !== undefined) {
                        ids[id]++;
                        id = `${id}-${ids[id]}`;
                    } else {
                        ids[id] = 0;
                    }
                    return id;
                };

                tokens.forEach((token) => {
                    if (token.type === 'heading') {
                        headings.push({
                            text: token.text,
                            depth: token.depth,
                        });
                    }
                });

                headings.forEach((h) => {
                    h.id = getUniqueId(h.text);
                });

                for (const key in ids) delete ids[key];

                const renderer = {
                    heading({ tokens, depth, text }) {
                        const id = getUniqueId(text);
                        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
                    },
                };

                const customMarked = new Marked({ renderer });
                const htmlContent = customMarked.parse(content);

                return {
                    props: {
                        title: data.title || slug[slug.length - 1],
                        html: htmlContent,
                        headings,
                    },
                };
            } catch (err) {
                console.error(`Error reading local note '${targetSlug}':`, err);
                return { notFound: true };
            }
        }
    }

    if (!GITHUB_PAT) {
        console.warn('GITHUB_PAT is not set.')
        return { notFound: true }
    }

    try {
        // Fetch Git tree to resolve the dashed slug to the actual file path
        let treeResponse = await fetch(`https://api.github.com/repos/${repo}/git/trees/main?recursive=1`, {
            headers: {
                Authorization: `token ${GITHUB_PAT}`,
            },
        });

        if (treeResponse.status === 404) {
            treeResponse = await fetch(`https://api.github.com/repos/${repo}/git/trees/master?recursive=1`, {
                headers: {
                    Authorization: `token ${GITHUB_PAT}`,
                },
            });
        }

        if (!treeResponse.ok) {
            console.error(`Failed to fetch repo tree: ${treeResponse.status} ${treeResponse.statusText}`);
            return { notFound: true };
        }

        const treeData = await treeResponse.json();
        const matchedFile = treeData.tree.find(file => {
            return file.type === 'blob' && file.path.endsWith('.md') && pathToSlug(file.path) === targetSlug;
        });

        if (!matchedFile) {
            return { notFound: true };
        }

        const resolvedPath = matchedFile.path.split('/').map(encodeURIComponent).join('/');

        const response = await fetch(
            `https://api.github.com/repos/${repo}/contents/${resolvedPath}`,
            {
                headers: {
                    Authorization: `token ${GITHUB_PAT}`,
                    Accept: 'application/vnd.github.v3.raw',
                },
            }
        )

        if (!response.ok) {
            return { notFound: true } // File doesn't exist
        }

        const rawContent = await response.text()

        // Parse the frontmatter
        const { data, content } = matter(rawContent)

        // Gatekeeper
        if (data.public !== true) {
            return { notFound: true }
        }

        // Extract headings and generate HTML with matching unique IDs
        const tempMarked = new Marked()
        const tokens = tempMarked.lexer(content)
        const headings = []
        const ids = {}

        const getUniqueId = (text) => {
            let id = text
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '')
            if (ids[id] !== undefined) {
                ids[id]++
                id = `${id}-${ids[id]}`
            } else {
                ids[id] = 0
            }
            return id
        }

        // 1. Gather all heading tokens
        tokens.forEach((token) => {
            if (token.type === 'heading') {
                headings.push({
                    text: token.text,
                    depth: token.depth,
                })
            }
        })

        // 2. Assign unique IDs to headings
        headings.forEach((h) => {
            h.id = getUniqueId(h.text)
        })

        // 3. Reset unique IDs map before compiling to ensure matching sequential IDs
        for (const key in ids) delete ids[key]

        const renderer = {
            heading({ tokens, depth, text }) {
                const id = getUniqueId(text)
                return `<h${depth} id="${id}">${text}</h${depth}>\n`
            },
        }

        const customMarked = new Marked({ renderer })
        const htmlContent = customMarked.parse(content)

        return {
            props: {
                title: data.title || slug[slug.length - 1],
                html: htmlContent,
                headings,
            },
        }
    } catch (err) {
        console.error('Error fetching note:', err)
        return { notFound: true }
    }
}
