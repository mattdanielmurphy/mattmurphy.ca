/**
 * Normalizes a file path from GitHub (e.g. "Development/Personal AI System.md")
 * into a clean, dashed URL slug (e.g. "Development/Personal-AI-System").
 */
export function pathToSlug(filePath) {
    return filePath
        .toLowerCase()
        .replace(/\.md$/, '')
        .split('/')
        .map((segment) => segment.replace(/\s+/g, '-'))
        .join('/')
}
