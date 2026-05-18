import Head from "next/head"
import { useRouter } from "next/router"
import styles from "./physics.module.css"

export default function PhysicsLabViewer() {
	const router = useRouter()
	const { id } = router.query

	if (!id) return null

	// Format title neatly
	const title = id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

	return (
		<>
			<Head>
				<title>{title} | Matt Murphy</title>
				<style>{`
					html, body {
						margin: 0;
						padding: 0;
						height: 100%;
						overflow: hidden; /* Prevent double scrollbars on the main window */
					}
				`}</style>
			</Head>
			<div className={styles.viewerContainer}>
				<iframe 
					src={`/physics-labs/${id}.html`} 
					className={styles.iframe}
					title={`Physics Lab: ${id}`}
					style={{ height: '100vh', width: '100vw', display: 'block', border: 'none' }}
				/>
			</div>
		</>
	)
}
