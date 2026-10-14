import Head from "next/head"
import styles from "@/styles/Kecak.module.css"

export default function Kecak() {
	return (
		<>
			<Head>
				<title>Kecak | Matthew Daniel Murphy</title>
				<meta name="robots" content="noindex, nofollow" />
			</Head>
			<main className={styles.main}>
				<div className={styles.videoWrapper}>
					<iframe
						className={styles.iframe}
						src="https://www.youtube.com/embed/ZDCcfnIMYr8?vq=hd2160&rel=0"
						title="Kecak"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowFullScreen
					/>
				</div>
			</main>
		</>
	)
}
