import Head from "next/head"
import styles from "./Layout.module.css"

export default function Layout({ children, title = "Matt Murphy" }) {
	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
			</Head>
			<main className={styles.main}>{children}</main>
			<footer className={styles.footer}>© {new Date().getFullYear()} Matthew Daniel Murphy</footer>
		</>
	)
}
