import { useState, useEffect } from 'react';
import matter from 'gray-matter';
import { Marked, marked } from 'marked';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/Notes.module.css';

export default function NotePage({ title, html, headings = [] }) {
  const [activeId, setActiveId] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean);

      let currentActive = '';
      for (const el of headingElements) {
        const rect = el.getBoundingClientRect();
        // If the heading is within 120px of the top of the viewport
        if (rect.top <= 120) {
          currentActive = el.id;
        }
      }

      if (!currentActive && headingElements.length > 0) {
        currentActive = headingElements[0].id;
      }

      setActiveId(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  return (
    <div className={styles.noteContainer}>
      <Head>
        <title>{title}</title>
      </Head>
      
      <div className={styles.controls}>
        <Link href="/notes" className={styles.backLink}>
          &larr; Back to Notes
        </Link>
        {headings.length > 0 && (
          <button 
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
            className={styles.toggleButton}
            aria-label={isSidebarVisible ? 'Hide outline' : 'Show outline'}
          >
            {isSidebarVisible ? 'Hide Outline' : 'Show Outline'}
          </button>
        )}
      </div>
      
      <div className={`${styles.layoutWrapper} ${!isSidebarVisible ? styles.sidebarHidden : ''}`}>
        {headings.length > 0 && isSidebarVisible && (
          <aside className={styles.sidebar}>
            <nav className={styles.outlineNav}>
              <ul className={styles.outlineList}>
                {headings.map((heading) => (
                  <li
                    key={heading.id}
                    className={`${styles.outlineItem} ${styles[`depth${heading.depth}`] || ''} ${
                      activeId === heading.id ? styles.activeOutlineItem : ''
                    }`}
                  >
                    <a href={`#${heading.id}`}>{heading.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
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
  );
}

export async function getStaticPaths() {
  return {
    paths: [], // Do not pre-render notes at build time
    fallback: 'blocking', // Generate on first request, cache subsequent requests
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params; // slug is an array
  const pathParts = slug.map(encodeURIComponent);
  const filePath = pathParts.join('/') + '.md';
  const repo = 'mattdanielmurphy/personal-notes';
  const GITHUB_PAT = process.env.GITHUB_PAT;

  if (!GITHUB_PAT) {
    console.warn('GITHUB_PAT is not set.');
    return { notFound: true };
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      {
        headers: {
          Authorization: `token ${GITHUB_PAT}`,
          Accept: 'application/vnd.github.v3.raw',
        },
      }
    );

    if (!response.ok) {
      return { notFound: true }; // File doesn't exist
    }

    const rawContent = await response.text();
    
    // Parse the frontmatter
    const { data, content } = matter(rawContent);

    // Gatekeeper
    if (data.public !== true) {
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

    // 1. Gather all heading tokens
    tokens.forEach((token) => {
      if (token.type === 'heading') {
        headings.push({
          text: token.text,
          depth: token.depth,
        });
      }
    });

    // 2. Assign unique IDs to headings
    headings.forEach((h) => {
      h.id = getUniqueId(h.text);
    });

    // 3. Reset unique IDs map before compiling to ensure matching sequential IDs
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
    console.error('Error fetching note:', err);
    return { notFound: true };
  }
}

