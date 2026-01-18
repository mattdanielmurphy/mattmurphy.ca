import styles from "../styles/ContactForm.module.css"
import { useState } from "react"

export default function ContactForm() {
	const [status, setStatus] = useState(null)
	const [error, setError] = useState(null)
	const [email, setEmail] = useState("")
	const [message, setMessage] = useState("")
	const [isEmailFocused, setIsEmailFocused] = useState(false)

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	const isEmailValid = emailRegex.test(email)
	const isMessageValid = message.trim().length > 0
	const isValid = isEmailValid && isMessageValid

	const handleFormSubmit = async (event) => {
		event.preventDefault()
		setStatus("pending")
		setError(null)

		try {
			const data = { email, message }

			const res = await fetch("/api/send", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			})

			if (!res.ok) throw new Error(await res.text())

			setStatus("success")
			setEmail("")
			setMessage("")
		} catch (e) {
			console.error(e)
			setStatus("error")
			setError("Something went wrong. Please try again.")
		}
	}

	return (
		<div className={styles.container}>
			{status === "success" ?
				<div className={styles.successMessage}>Message sent! I&apos;ll get back to you soon.</div>
			:	<form onSubmit={handleFormSubmit} className={styles.form}>
					<input type='text' name='website_url' style={{ position: "absolute", opacity: 0, zIndex: -1, width: 0 }} tabIndex={-1} autoComplete='off' />

					<div className={styles.formGroup}>
						<label htmlFor='email' className={styles.label}>
							Your Email
						</label>
						<div className={styles.inputWrapper}>
							<input
								type='email'
								name='email'
								id='email'
								required
								className={styles.input}
								autocomplete='on'
								placeholder='name@example.com'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								onFocus={() => setIsEmailFocused(true)}
								onBlur={() => setIsEmailFocused(false)}
							/>
							{!isEmailValid && email.length > 0 && !isEmailFocused && <div className={styles.tooltip}>Please enter a valid email address</div>}
						</div>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor='message' className={styles.label}>
							Message
						</label>
						<textarea name='message' id='message' required rows={5} className={styles.textarea} placeholder='What&#39;s on your mind?' value={message} onChange={(e) => setMessage(e.target.value)} />
					</div>

					<div className={styles.buttonWrapper}>
						<button type='submit' disabled={status === "pending" || !isValid} className={`${styles.button} ${isValid ? styles.visible : styles.hidden} btn`}>
							{status === "pending" ? "Sending..." : "Send Message"}
						</button>
					</div>

					{status === "error" && <div className={styles.errorMessage}>{error}</div>}
				</form>
			}
		</div>
	)
}
