import Image from 'next/image'

export default function JiroDreamsOfSushi() {
	const handleDownload = () => {
		window.location.replace(
			'https://drive.usercontent.google.com/download?id=1tC83R_ygINpYwd38InoSiAmCvjnXi3Oe&export=download&authuser=0',
		)
	}

	return (
		<main id='jiro'>
			<div>
				<Image
					src='/jiro-poster.jpg'
					alt='Jiro Dreams of Sushi Movie Poster'
					width={250}
					height={375}
					priority
				/>
				<button onClick={handleDownload} style={styles.button}>
					Download
				</button>
			</div>
		</main>
	)
}

const styles = {
	button: {
		backgroundColor: '#444',
		border: 'none',
		color: 'white',
		padding: '15px 32px',
		textAlign: 'center',
		textTransform: 'uppercase',
		letterSpacing: '.02em',
		textDecoration: 'none',
		display: 'inline-block',
		fontSize: '16px',
		margin: '4px 2px',
		cursor: 'pointer',
		borderRadius: '4px',
	},
}
