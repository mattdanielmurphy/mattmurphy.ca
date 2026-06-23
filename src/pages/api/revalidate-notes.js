export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Bypass Cloudflare for the internal loopback request
  if (process.env.VERCEL_URL) {
    req.headers.host = process.env.VERCEL_URL;
  }

  try {
    console.log('Revalidating notes index...');
    // Revalidate the index page
    await res.revalidate('/notes');

    // Parse the webhook payload to find modified files
    if (req.body && req.body.commits) {
      const commits = req.body.commits;
      const filesToRevalidate = new Set();

      commits.forEach((commit) => {
        const changedFiles = [
          ...(commit.added || []),
          ...(commit.modified || []),
          ...(commit.removed || [])
        ];

        changedFiles.forEach((file) => {
          if (file.endsWith('.md')) {
            // Remove .md and encode each part
            const pathParts = file.replace(/\.md$/, '').split('/');
            const encodedPath = pathParts.map(encodeURIComponent).join('/');
            filesToRevalidate.add(`/notes/${encodedPath}`);
          }
        });
      });

      // Revalidate individual note pages
      for (const route of filesToRevalidate) {
        console.log(`Revalidating route: ${route}`);
        try {
          await res.revalidate(route);
        } catch (e) {
          console.error(`Failed to revalidate ${route}:`, e);
          // Don't fail the whole request if one page fails to revalidate
        }
      }
    }

    return res.json({ revalidated: true });
  } catch (err) {
    console.error('Error revalidating:', err);
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
}
