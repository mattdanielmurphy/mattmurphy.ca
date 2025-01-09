import type { NextApiRequest, NextApiResponse } from "next"

import { createClient } from "@supabase/supabase-js"
import nodemailer from "nodemailer"

const supabaseUrl = "https://mxjkwzbcgefwdwifpgaz.supabase.co"
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log("[Cron] Starting scheduled email check at:", new Date().toISOString())

	// Verify the request is from Vercel Cron
	if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
		console.log("[Cron] Unauthorized request attempt")
		return res.status(401).json({ message: "Unauthorized" })
	}

	try {
		// Get all pending emails scheduled for now or earlier
		const now = new Date().toISOString()
		console.log("[Cron] Checking for emails scheduled before:", now)
		const { data: pendingEmails, error } = await supabase.from("scheduled_emails").select("*").lt("sendAt", now).eq("status", "pending")

		if (error) {
			console.error("[Cron] Error fetching pending emails:", error)
			throw error
		}
		if (!pendingEmails?.length) {
			console.log("[Cron] No pending emails found")
			return res.status(200).json({ message: "No pending emails" })
		}

		console.log(`[Cron] Found ${pendingEmails.length} pending emails to process`)

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
				console.log(`[Cron] Processing email ${email.id} to: ${email.to}`)
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
				console.log(`[Cron] Successfully sent email ${email.id}`)

				// Update email status to sent
				await supabase.from("scheduled_emails").update({ status: "sent", sentAt: new Date().toISOString() }).eq("id", email.id)
				console.log(`[Cron] Updated email ${email.id} status to sent`)
			} catch (error) {
				console.error(`[Cron] Error sending email ${email.id}:`, error)
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

		console.log(`[Cron] Finished processing ${pendingEmails.length} emails`)
		res.status(200).json({
			message: `Processed ${pendingEmails.length} emails`,
			processed: pendingEmails.length,
		})
	} catch (error) {
		console.error("Error processing scheduled emails:", error)
		res.status(500).json({ message: "Error processing scheduled emails", error })
	}
}
