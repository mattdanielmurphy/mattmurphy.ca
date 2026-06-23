import matter from 'gray-matter';
import AdmZip from 'adm-zip';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/Notes.module.css';
import { pathToSlug } from '../../utils/slug';

export default function NotesIndex({ notes }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Public Notes</title>
      </Head>
      <Link href="/" className={styles.backLink}>
        &larr; Back to Home
      </Link>
      <h1 className={styles.title}>Notes</h1>
      {notes.length === 0 ? (
        <p>No public notes found.</p>
      ) : (
        <ul className={styles.noteList}>
          {notes.map(note => (
            <li key={note.slug} className={styles.noteItem}>
              <Link href={`/notes/${note.slug}`} className={styles.noteLink}>
                <h2 className={styles.noteTitle}>{note.title}</h2>
                {note.slug.includes('/') && <p className={styles.notePath}>{note.slug}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export async function getStaticProps() {
  const GITHUB_PAT = process.env.GITHUB_PAT;
  const repo = 'mattdanielmurphy/personal-notes';

  // 1. In development, read directly from the local Obsidian vault if it exists
  const localVaultPath = '/Users/matthewmurphy/Library/Mobile Documents/iCloud~md~obsidian/Documents/Personal';
  if (process.env.NODE_ENV === 'development') {
    const fs = require('fs');
    if (fs.existsSync(localVaultPath)) {
      console.log('Loading notes from local Obsidian vault...');
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
      const publicNotes = [];

      for (const filePath of filePaths) {
        try {
          const rawContent = fs.readFileSync(filePath, 'utf8');
          const { data } = matter(rawContent);
          if (data.public === true) {
            const repoRelativePath = path.relative(localVaultPath, filePath);
            publicNotes.push({
              slug: pathToSlug(repoRelativePath),
              title: data.title || path.basename(filePath).replace(/\.md$/, ''),
            });
          }
        } catch (e) {
          // Silent catch for files that fail to parse
        }
      }

      console.log(`Found ${publicNotes.length} public notes from local vault.`);
      return {
        props: {
          notes: publicNotes,
        },
      };
    }
  }

  if (!GITHUB_PAT) {
    console.warn('GITHUB_PAT is not set. Cannot fetch notes.');
    return { props: { notes: [] } };
  }

  const devCachePath = './tmp/notes-cache.json';
  if (process.env.NODE_ENV === 'development') {
    const fs = require('fs');
    try {
      if (fs.existsSync(devCachePath)) {
        const stats = fs.statSync(devCachePath);
        const ageInMs = Date.now() - stats.mtimeMs;
        if (ageInMs < 300000) { // 5 minutes cache
          console.log('Loading notes from local dev cache...');
          const cachedData = JSON.parse(fs.readFileSync(devCachePath, 'utf8'));
          return { props: { notes: cachedData } };
        }
      }
    } catch (e) {
      console.warn('Failed to read dev cache:', e);
    }
  }

  // 2. Try fetching via GraphQL to avoid downloading the 21MB zip archive
  try {
    const repoOwner = 'mattdanielmurphy';
    const repoName = 'personal-notes';

    console.log('Fetching file tree from GitHub...');
    let treeResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/trees/main?recursive=1`, {
      headers: {
        Authorization: `token ${GITHUB_PAT}`,
      },
    });

    if (treeResponse.status === 404) {
      console.log('Main branch tree not found, trying master branch...');
      treeResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/trees/master?recursive=1`, {
        headers: {
          Authorization: `token ${GITHUB_PAT}`,
        },
      });
    }

    if (!treeResponse.ok) {
      throw new Error(`Failed to fetch repo tree: ${treeResponse.status} ${treeResponse.statusText}`);
    }

    const treeData = await treeResponse.json();
    const mdFiles = treeData.tree.filter(file => file.type === 'blob' && file.path.endsWith('.md'));
    console.log(`Found ${mdFiles.length} markdown files in GitHub tree.`);

    const branchName = treeResponse.url.includes('/trees/main') ? 'main' : 'master';

    // Construct GraphQL query to fetch the content of all markdown files
    const query = `
      query {
        repository(owner: "${repoOwner}", name: "${repoName}") {
          ${mdFiles.map((file, index) => `
            file_${index}: object(expression: "${branchName}:${file.path}") {
              ... on Blob {
                text
              }
            }
          `).join('\n')}
        }
      }
    `;

    console.log('Fetching markdown contents via GraphQL...');
    const gqlResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${GITHUB_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!gqlResponse.ok) {
      throw new Error(`GraphQL request failed: ${gqlResponse.status} ${gqlResponse.statusText}`);
    }

    const gqlData = await gqlResponse.json();
    const repository = gqlData.data?.repository || {};
    const publicNotes = [];

    mdFiles.forEach((file, index) => {
      const fileData = repository[`file_${index}`];
      if (fileData && fileData.text) {
        try {
          const { data } = matter(fileData.text);
          if (data.public === true) {
            publicNotes.push({
              slug: pathToSlug(file.path),
              title: data.title || file.path.split('/').pop().replace(/\.md$/, ''),
            });
          }
        } catch (e) {
          // ignore parsing error
        }
      }
    });

    console.log(`Found ${publicNotes.length} public notes via GraphQL.`);

    if (process.env.NODE_ENV === 'development') {
      const fs = require('fs');
      const path = require('path');
      try {
        fs.mkdirSync(path.dirname(devCachePath), { recursive: true });
        fs.writeFileSync(devCachePath, JSON.stringify(publicNotes, null, 2), 'utf8');
        console.log('Saved notes to local dev cache.');
      } catch (e) {
        console.warn('Failed to write dev cache:', e);
      }
    }

    return {
      props: {
        notes: publicNotes,
      },
    };

  } catch (error) {
    console.warn('Optimized GraphQL fetch failed, falling back to ZIP archive download:', error);
    
    // 3. Fallback to downloading ZIP archive
    try {
      console.log('Downloading repository ZIP archive from GitHub...');
      let response = await fetch(`https://api.github.com/repos/${repo}/zipball/main`, {
        headers: {
          Authorization: `token ${GITHUB_PAT}`,
        },
      });

      if (response.status === 404) {
        console.log('Main branch zipball not found, trying master branch...');
        response = await fetch(`https://api.github.com/repos/${repo}/zipball/master`, {
          headers: {
            Authorization: `token ${GITHUB_PAT}`,
          },
        });
      }

      if (!response.ok) {
        console.error(`Failed to download repo zipball: ${response.status} ${response.statusText}`);
        return { props: { notes: [] } };
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const zip = new AdmZip(buffer);
      const zipEntries = zip.getEntries();
      const publicNotes = [];

      console.log(`Processing ${zipEntries.length} archive entries...`);

      for (const entry of zipEntries) {
        if (entry.isDirectory) continue;

        const pathParts = entry.entryName.split('/');
        if (pathParts.length <= 1) continue;

        const repoRelativePath = pathParts.slice(1).join('/');
        if (repoRelativePath.endsWith('.md')) {
          try {
            const rawContent = entry.getData().toString('utf8');
            const { data } = matter(rawContent);
            if (data.public === true) {
              publicNotes.push({
                slug: pathToSlug(repoRelativePath),
                title: data.title || repoRelativePath.split('/').pop().replace(/\.md$/, ''),
              });
            }
          } catch (e) {
            console.error(`Error parsing frontmatter for ${repoRelativePath}:`, e);
          }
        }
      }

      console.log(`Found ${publicNotes.length} public notes via ZIP.`);

      if (process.env.NODE_ENV === 'development') {
        const fs = require('fs');
        const path = require('path');
        try {
          fs.mkdirSync(path.dirname(devCachePath), { recursive: true });
          fs.writeFileSync(devCachePath, JSON.stringify(publicNotes, null, 2), 'utf8');
          console.log('Saved notes to local dev cache.');
        } catch (e) {
          console.warn('Failed to write dev cache:', e);
        }
      }

      return {
        props: {
          notes: publicNotes,
        },
      };
    } catch (fallbackError) {
      console.error('ZIP fallback download also failed:', fallbackError);
      return { props: { notes: [] } };
    }
  }
}

