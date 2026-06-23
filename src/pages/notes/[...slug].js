import matter from 'gray-matter';
import { marked } from 'marked';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/Notes.module.css';

export default function NotePage({ title, html }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
      </Head>
      <Link href="/notes" className={styles.backLink}>
        &larr; Back to Notes
      </Link>
      <div 
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: html }} 
      />
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

    // Convert Markdown to HTML
    const htmlContent = marked(content);

    return {
      props: {
        title: data.title || slug[slug.length - 1],
        html: htmlContent,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (err) {
    console.error('Error fetching note:', err);
    return { notFound: true };
  }
}
