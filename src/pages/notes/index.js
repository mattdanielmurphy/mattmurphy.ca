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

  try {
    // 1. Fetch the entire tree from the default branch (assuming main, fallback to master if needed)
    let treeRes = await fetch(`https://api.github.com/repos/${repo}/git/trees/main?recursive=1`, {
      headers: {
        Authorization: `token ${GITHUB_PAT}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (treeRes.status === 404) {
      // Try master if main doesn't exist
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
    
    // Filter out non-markdown files
    const mdFiles = treeData.tree.filter(file => file.type === 'blob' && file.path.endsWith('.md'));

    // 2. Fetch contents of all markdown files concurrently to parse frontmatter
    // We use Promise.all to fetch them in parallel.
    const notePromises = mdFiles.map(async (file) => {
      const encodedPath = file.path.split('/').map(encodeURIComponent).join('/');
      const fileRes = await fetch(`https://api.github.com/repos/${repo}/contents/${encodedPath}`, {
        headers: {
          Authorization: `token ${GITHUB_PAT}`,
          Accept: 'application/vnd.github.v3.raw',
        },
      });

      if (!fileRes.ok) return null;
      
      const rawContent = await fileRes.text();
      try {
        const { data } = matter(rawContent);
        if (data.public === true) {
          return {
            slug: file.path.replace(/\.md$/, ''), // Removes .md
            title: data.title || file.path.split('/').pop().replace(/\.md$/, ''),
          };
        }
      } catch (e) {
        // If frontmatter parsing fails, it's not a public note
      }
      return null;
    });

    const results = await Promise.all(notePromises);
    const publicNotes = results.filter(Boolean); // Remove nulls

    return {
      props: {
        notes: publicNotes,
      },
      revalidate: 300, // Revalidate every 5 minutes (300 seconds)
    };
  } catch (error) {
    console.error('Error fetching notes:', error);
    return { props: { notes: [] }, revalidate: 60 };
  }
}
