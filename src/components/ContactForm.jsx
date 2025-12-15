import styles from '../styles/ContactForm.module.css'
import { useState } from 'react'

export default function ContactForm() {
	const [ status, setStatus ] = useState(null)
	const [ error, setError ] = useState(null)

	const handleFormSubmit = async (event) => {
		event.preventDefault()

		// Clear previous states
		setStatus('pending')
		setError(null)

		try {
			const formData = new FormData(event.target)
			const data = Object.fromEntries(formData.entries())

			// Sanitize inputs
			if (typeof data.email === 'string') {
				// Remove all whitespace (spaces, newlines, etc.) from email
				data.email = data.email.replace(/\s/g, '')
			}
			if (typeof data.message === 'string') {
				// Trim leading/trailing whitespace from message
				data.message = data.message.trim()
			}

			// 1. HONEYPOT CHECK: If the hidden field is filled, it's a bot.
			// We "pretend" it succeeded to confuse the bot, but do nothing.
			if (data.website_url) {
				setStatus('success')
				return
			}

			const res = await fetch('/api/send', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			})

			if (!res.ok) throw new Error(await res.text())

			setStatus('success')
			// Optional: Reset form
			event.target.reset()
		} catch (e) {
			console.error(e)
			setStatus('error')
			setError('Something went wrong. Please try again.')
		}
	}

	return (
		<div className={styles.container}>
			{status === 'success' ? (
				<div className={styles.successMessage}>Message sent! I&apos;ll get back to you soon.</div>
			) : (
				<form onSubmit={handleFormSubmit} className={styles.form}>
					{/* HONEYPOT: Hidden from real users. Bots fill it out. */}
					<input type='text' name='website_url' style={{ position: 'absolute', opacity: 0, zIndex: -1, width: 0 }} tabIndex={-1} autoComplete='off' />

					<div className={styles.formGroup}>
						<label htmlFor='email' className={styles.label}>
							Your Email
						</label>
						<input type='email' name='email' id='email' required className={styles.input} placeholder='name@example.com' />
					</div>

					<div className={styles.formGroup}>
						<label htmlFor='message' className={styles.label}>
							Message
						</label>
						<textarea name='message' id='message' required rows={5} className={styles.textarea} placeholder='What&#39;s on your mind?' />
					</div>

					<button type='submit' disabled={status === 'pending'} className={styles.button}>
						{status === 'pending' ? 'Sending...' : 'Send Message'}
					</button>

					{status === 'error' && <div className={styles.errorMessage}>{error}</div>}
				</form>
			)}
		</div>
	)
}
