import type { NextApiRequest, NextApiResponse } from "next"

import { createClient } from "@supabase/supabase-js"
import nodemailer from "nodemailer"

const supabaseUrl = "https://mxjkwzbcgefwdwifpgaz.supabase.co"
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Verify the request is from Vercel Cron
	if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
		return res.status(401).json({ message: "Unauthorized" })
	}

	try {
		// Get all pending emails scheduled for now or earlier
		const now = new Date().toISOString()
		const { data: pendingEmails, error } = await supabase.from("scheduled_emails").select("*").lt("sendAt", now).eq("status", "pending")

		if (error) throw error
		if (!pendingEmails?.length) {
			return res.status(200).json({ message: "No pending emails" })
		}

		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: parseInt(process.env.SMTP_PORT || "587"),
			secure: process.env.SMTP_SECURE === "true",
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		})

		// Send each pending email
		for (const email of pendingEmails) {
			try {
				const mailOptions = {
					from: process.env.SMTP_FROM,
					to: email.to,
					cc: email.cc,
					bcc: email.bcc,
					subject: email.subject,
					html: email.html,
					inReplyTo: email.inReplyTo,
					references: email.references,
				}

				await transporter.sendMail(mailOptions)

				// Update email status to sent
				await supabase.from("scheduled_emails").update({ status: "sent", sentAt: new Date().toISOString() }).eq("id", email.id)
			} catch (error) {
				console.error(`Error sending email ${email.id}:`, error)
				// Mark as failed
				await supabase
					.from("scheduled_emails")
					.update({
						status: "failed",
						error: error.message,
					})
					.eq("id", email.id)
			}
		}

		res.status(200).json({
			message: `Processed ${pendingEmails.length} emails`,
			processed: pendingEmails.length,
		})
	} catch (error) {
		console.error("Error processing scheduled emails:", error)
		res.status(500).json({ message: "Error processing scheduled emails", error })
	}
}
