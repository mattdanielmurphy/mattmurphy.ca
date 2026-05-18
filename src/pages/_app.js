import "@/styles/globals.css"

import { Cormorant, Lato } from "next/font/google"

import Head from "next/head"

const cormorant = Cormorant({
	subsets: ["latin"],
	style: ["normal", "italic"],
	variable: "--font-cormorant",
	display: "swap",
})

const lato = Lato({
	subsets: ["latin"],
	weight: ["400", "700"],
	variable: "--font-lato",
	display: "swap",
})

export default function App({ Component, pageProps }) {
	return (
		<div className={`${cormorant.variable} ${lato.variable} ${lato.className}`}>
			<Head>
				<style>{`
					html, body {
						font-family: var(--font-lato), sans-serif !important;
					}
					h1, h2, h3, h4, h5, h6 {
						font-family: var(--font-cormorant), serif;
					}
				`}</style>
			</Head>
			<Component {...pageProps} />
		</div>
	)
}
