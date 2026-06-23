import matter from 'gray-matter';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/Notes.module.css';

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

  if (!GITHUB_PAT) {
    console.warn('GITHUB_PAT is not set. Cannot fetch notes.');
    return { props: { notes: [] }, revalidate: 60 };
  }

  // Helper to fetch file contents in concurrent batches to avoid secondary rate limits
  const batchFetch = async (files, batchSize = 5) => {
    const results = [];
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (file) => {
          const encodedPath = file.path.split('/').map(encodeURIComponent).join('/');
          try {
            const fileRes = await fetch(`https://api.github.com/repos/${repo}/contents/${encodedPath}`, {
              headers: {
                Authorization: `token ${GITHUB_PAT}`,
                Accept: 'application/vnd.github.v3.raw',
              },
            });

            if (!fileRes.ok) {
              console.error(`Failed to fetch content for ${file.path}: ${fileRes.status} ${fileRes.statusText}`);
              return null;
            }

            const rawContent = await fileRes.text();
            const { data } = matter(rawContent);
            if (data.public === true) {
              return {
                slug: file.path.replace(/\.md$/, ''), // Removes .md
                title: data.title || file.path.split('/').pop().replace(/\.md$/, ''),
              };
            }
          } catch (e) {
            console.error(`Error parsing frontmatter or fetching ${file.path}:`, e);
          }
          return null;
        })
      );
      results.push(...batchResults);
    }
    return results.filter(Boolean);
  };

  try {
    // 1. Try to search for "public: true" in markdown files using the Code Search API first
    console.log('Searching for public notes via GitHub Code Search API...');
    const searchRes = await fetch(
      `https://api.github.com/search/code?q=repo:${repo}+"public:+true"+extension:md`,
      {
        headers: {
          Authorization: `token ${GITHUB_PAT}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      console.log(`Found ${searchData.items ? searchData.items.length : 0} candidate files via search.`);
      if (searchData.items && searchData.items.length > 0) {
        const publicNotes = await batchFetch(searchData.items);
        return {
          props: {
            notes: publicNotes,
          },
        };
      }
    } else {
      console.warn(`GitHub Code Search API failed (${searchRes.status}). Falling back to full tree scan.`);
    }

    // 2. Fallback: Fetch the entire tree from the default branch
    console.log('Running fallback: scanning repository tree...');
    let treeRes = await fetch(`https://api.github.com/repos/${repo}/git/trees/main?recursive=1`, {
      headers: {
        Authorization: `token ${GITHUB_PAT}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (treeRes.status === 404) {
      treeRes = await fetch(`https://api.github.com/repos/${repo}/git/trees/master?recursive=1`, {
        headers: {
          Authorization: `token ${GITHUB_PAT}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
    }

    if (!treeRes.ok) {
      console.error('Failed to fetch repo tree:', await treeRes.text());
      return { props: { notes: [] }, revalidate: 60 };
    }

    const treeData = await treeRes.json();
    const mdFiles = treeData.tree.filter(file => file.type === 'blob' && file.path.endsWith('.md'));
    console.log(`Scanning all ${mdFiles.length} markdown files in fallback mode...`);
    const publicNotes = await batchFetch(mdFiles);

    return {
      props: {
        notes: publicNotes,
      },
    };
  } catch (error) {
    console.error('Error fetching notes:', error);
    return { props: { notes: [] }, revalidate: 60 };
  }
}

