import Divider from "@/components/Divider"
import Layout from "@/components/Layout"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { projects } from "@/data/projects"
import remarkGfm from "remark-gfm"
import styles from "@/styles/Project.module.css"

export default function Project({ project, readmeContent }) {
	return (
		<Layout title={`${project.title} - Matt Murphy`}>
			<div className={styles.bgWrapper}>
				<div className={styles.container}>
					<div className={styles.header}>
						<Link href='/' className={styles.backLink}>
							← Back
						</Link>
						<div className={styles.titleWrapper}>
							<h1 className={styles.title}>{project.title}</h1>
							{/* <Divider className={styles.titleDivider} /> */}
							<div className={styles.tags}>
								{project.tags.map((tag) => (
									<span key={tag} className='tag-chip'>
										{tag}
									</span>
								))}
							</div>
						</div>
					</div>

					<div className={styles.content}>
						<p className={styles.description}>{project.description}</p>

						<div className={styles.links}>
							{project.live && (
								<a href={project.live} target='_blank' rel='noopener noreferrer' className='btn'>
									Visit Live Site
								</a>
							)}
							{project.repo && (
								<a href={project.repo} target='_blank' rel='noopener noreferrer' className='btn'>
									Source Code
								</a>
							)}
							{project.extraLinks &&
								project.extraLinks.map((link) => (
									<a key={link.url} href={link.url} target='_blank' rel='noopener noreferrer' className='btn'>
										{link.label}
									</a>
								))}
						</div>

						{readmeContent && (
							<div className={styles.readme}>
								<hr className={styles.divider} />
								<ReactMarkdown remarkPlugins={[remarkGfm]}>{readmeContent}</ReactMarkdown>
							</div>
						)}
					</div>
				</div>
			</div>
		</Layout>
	)
}

export async function getStaticPaths() {
	const paths = projects.map((project) => ({
		params: { slug: project.slug },
	}))

	return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
	const project = projects.find((p) => p.slug === params.slug)
	let readmeContent = null

	if (project?.repo) {
		try {
			// Extract owner and repo name from the URL
			// Example: https://github.com/mattdanielmurphy/block-puzzle -> mattdanielmurphy/block-puzzle
			const repoPath = project.repo.replace("https://github.com/", "")
			const apiUrl = `https://api.github.com/repos/${repoPath}/readme`

			const headers = {
				"User-Agent": "MattMurphy-Portfolio-Scraper/1.0",
				Accept: "application/vnd.github.raw",
			}

			if (process.env.GITHUB_TOKEN) {
				headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`
			}

			const res = await fetch(apiUrl, { headers })

			if (res.ok) {
				readmeContent = await res.text()
			} else {
				console.warn(`Failed to fetch README for ${project.slug}: ${res.status} ${res.statusText}`)
			}
		} catch (error) {
			console.error(`Failed to fetch README for ${project.slug}`, error)
		}
	}

	return {
		props: {
			project,
			readmeContent,
		},
		revalidate: 60, // Revalidate every minute
	}
}
