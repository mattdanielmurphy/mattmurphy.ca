const Modal = ({ isOpen, onClose }) => {
	if (!isOpen) return null

	return (
		<div style={styles.modalOverlay}>
			<div style={styles.modalContent}>
				<h3>
					Note: On the next page, click <em>Download</em> above the video
					player. Don't play the video on the page.
				</h3>
				<p>
					The quality is <em>atrocious</em> when streamed on OneDrive.
				</p>
				<p>
					<strong>Jiro deserves better.</strong>
				</p>
				<button onClick={onClose} style={styles.proceedButton}>
					Proceed
				</button>
			</div>
		</div>
	)
}

const styles = {
	modalOverlay: {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.9)',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		backgroundColor: 'var(--modal-bg-color)',
		color: 'var(--modal-text-color)',
		padding: '20px',
		borderRadius: '8px',
		maxWidth: '500px',
		width: '100%',
		textAlign: 'center',
	},
	proceedButton: {
		backgroundColor: '#00a929',
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
		marginTop: '20px',
		cursor: 'pointer',
		borderRadius: '4px',
	},
}

export default Modal
