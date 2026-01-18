import Link from "next/link"
import styles from "./ProjectCard.module.css"

export default function ProjectCard({ project }) {
	return (
		<Link href={`/projects/${project.slug}`} className={styles.card}>
			<div className={styles.cardMain}>
				<div className={styles.header}>
					<h3 className={styles.title}>
						{"‣ "}
						{project.title}
					</h3>
					<div className={styles.tags}>
						{project.tags.map((tag) => (
							<span key={tag} className='tag-chip'>
								{tag}
							</span>
						))}
					</div>
				</div>
				<p className={styles.description}>{project.description}</p>
			</div>
			<div className={styles.seeProject}>
				<span>See Project</span>
				<svg className={styles.arrow} width='14' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
					<path d='M2 12h20m-7-7 7 7-7 7' />
				</svg>
			</div>
		</Link>
	)
}
