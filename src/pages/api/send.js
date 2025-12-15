import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" })
	}

	const body = req.body

	// Simple Spam Check: Honeypot
	if (body.website_url) {
		// Create a hidden field named 'website_url' in your frontend
		return res.status(200).json({ status: "ok" }) // Pretend it worked
	}

	try {
		if (!process.env.CONTACT_FORM_SENDER_EMAIL) {
			console.error("Missing CONTACT_FORM_SENDER_EMAIL environment variable")
			return res.status(500).json({ error: "Missing CONTACT_FORM_SENDER_EMAIL environment variable" })
		}
		const from = `Matt Murphy <${process.env.CONTACT_FORM_SENDER_EMAIL}>`

		if (!process.env.CONTACT_FORM_RECIPIENT_EMAIL) {
			console.error("Missing CONTACT_FORM_RECIPIENT_EMAIL environment variable")
			return res.status(500).json({ error: "Missing CONTACT_FORM_RECIPIENT_EMAIL environment variable" })
		}

		const [adminData, userData] = await Promise.all([
			// 1. Email to Matt (Admin)
			resend.emails.send({
				from,
				to: [process.env.CONTACT_FORM_RECIPIENT_EMAIL],
				subject: `Inquiry from ${body.email}: ${body.message.substring(0, 50).replace(/\n/g, " ")}...`,
				text: body.message,
				replyTo: body.email,
			}),
			// 2. Confirmation Email to User
			resend.emails.send({
				from,
				to: [body.email],
				subject: "Message Received - Matt Murphy",
				text: `Hi there,\n\nThanks for reaching out! I've received your message and will get back to you shortly.\n\nHere is a copy of your message:\n\n---\n${body.message}\n---\n\nBest,\nMatt`,
			}),
		])

		if (adminData.error || userData.error) {
			console.error("Resend Admin Email Error:", adminData.error)
			console.error("Resend User Email Error:", userData.error)
			return res.status(500).json({
				error: "Failed to send email",
				details: {
					admin: adminData.error,
					user: userData.error,
				},
			})
		}

		return res.status(200).json({ admin: adminData, user: userData })
	} catch (error) {
		console.error("Resend API Unexpected Error:", error)
		return res.status(500).json({ error: error.message || "Internal Server Error", details: error })
	}
}
