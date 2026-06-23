import matter from 'gray-matter';
import AdmZip from 'adm-zip';
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
    return { props: { notes: [] } };
  }

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
              slug: repoRelativePath.replace(/\.md$/, ''), // Removes .md
              title: data.title || repoRelativePath.split('/').pop().replace(/\.md$/, ''),
            });
          }
        } catch (e) {
          console.error(`Error parsing frontmatter for ${repoRelativePath}:`, e);
        }
      }
    }

    console.log(`Found ${publicNotes.length} public notes.`);

    return {
      props: {
        notes: publicNotes,
      },
    };
  } catch (error) {
    console.error('Error fetching notes:', error);
    return { props: { notes: [] } };
  }
}

