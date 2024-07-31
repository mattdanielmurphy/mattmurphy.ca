import Image from 'next/image'

export default function JiroDreamsOfSushi() {
	// useEffect(() => {
	// 	window.location.replace(
	// 		'https://6ycdj3-my.sharepoint.com/:v:/g/personal/matt_6ycdj3_onmicrosoft_com/Ecrlz6TDnrJCmJbv79nDSjIBt4bZEqsxC_k2lW00vJTybg?e=lfg9KV',
	// 	)
	// })
	const handleDownload = () => {
		const downloadUrl =
			'https://6ycdj3-my.sharepoint.com/personal/matt_6ycdj3_onmicrosoft_com/_layouts/15/download.aspx?UniqueId=a4cfe5ca-9ec3-42b2-9896-efefd9c34a32'

		// Create a temporary anchor element
		const link = document.createElement('a')
		link.href = downloadUrl

		// Set the download attribute to suggest a filename (optional)
		link.download = 'video.mp4' // Replace with your desired filename

		// Append to the body, click, and remove
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	return (
		<main id='jiro'>
			<div>
				<Image
					src='/jiro-poster.jpg'
					alt='Jiro Dreams of Sushi Movie Poster'
					width={500}
					height={750}
					layout='responsive'
					priority
				/>
				<button onClick={handleDownload} style={styles.button}>
					Download
				</button>
			</div>
		</main>
	)

	// Some basic styles for the button
}
const styles = {
	button: {
		backgroundColor: '#000',
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
