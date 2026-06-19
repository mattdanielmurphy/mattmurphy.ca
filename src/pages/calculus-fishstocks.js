import Head from "next/head"
import styles from "./physics/physics.module.css"

export default function CalculusFishstocks() {
	return (
		<>
			<Head>
				<title>Calculus Fishstocks | Matthew Daniel Murphy</title>
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
					src="/calculus-labs/calculus-fishstocks.html" 
					className={styles.iframe}
					title="Calculus Project: Fishstocks"
					style={{ height: '100vh', width: '100vw', display: 'block', border: 'none' }}
				/>
			</div>
		</>
	)
}
