import ContactForm from "@/components/ContactForm"
import Layout from "@/components/Layout"
import ProjectCard from "@/components/ProjectCard"
import { projects } from "@/data/projects"
import styles from "@/styles/Home.module.css"

export default function Home() {
	return (
		<Layout>
			<section className={styles.hero}>
				<div className={styles.heroContent}>
					<h1 className={styles.title}>Matthew Daniel Murphy</h1>
					{/* <p className={styles.subtitle}>Drummer and computer guy.</p> */}
				</div>
			</section>

			<div className={styles.mainContent}>
				<section className={styles.projects}>
					<div className={styles.container}>
						<h2 className={styles.sectionTitle}>Projects</h2>
						<div className={styles.grid}>
							{projects.map((project) => (
								<ProjectCard key={project.slug} project={project} />
							))}
						</div>
					</div>
				</section>

				<section className={styles.contact}>
					<div className={styles.container}>
						<h2 className={styles.sectionTitle}>Contact</h2>
						<ContactForm />
					</div>
				</section>
			</div>
		</Layout>
	)
}
