import Image from "next/image"
import styles from "@/styles/Jiro.module.css"

export default function JiroDreamsOfSushi() {
	const handleDownload = () => {
		window.location.replace("https://drive.usercontent.google.com/download?id=1tC83R_ygINpYwd38InoSiAmCvjnXi3Oe&export=download&authuser=0")
	}

	return (
		<main className={styles.main}>
			<div className={styles.container}>
				<Image src='/jiro-poster.jpg' alt='Jiro Dreams of Sushi Movie Poster' width={250} height={375} priority />
				<button onClick={handleDownload} className={styles.button}>
					Download
				</button>
			</div>
		</main>
	)
}
