import type { NextApiRequest, NextApiResponse } from "next"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://mxjkwzbcgefwdwifpgaz.supabase.co"
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseKey) {
	console.warn("SUPABASE_KEY is not defined in environment variables.")
}

// Create a single supabase client for interacting with your database
const supabase = supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log("[Cron] Starting supabase keep-alive ping at:", new Date().toISOString())

	// Verify the request is from Vercel Cron
	if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
		console.log("[Cron] Unauthorized keep-alive attempt")
		return res.status(401).json({ message: "Unauthorized" })
	}

	if (!supabase) {
		console.error("[Cron] Supabase client not initialized")
		return res.status(500).json({ message: "Supabase client not initialized" })
	}

	try {
		// Ping a lightweight table to keep the database active
		const { data, error } = await supabase.from("waking-up-login-codes").select("id").limit(1)

		if (error) {
			console.error("[Cron] Error pinging Supabase:", error)
			return res.status(500).json({ message: "Error pinging database", error: error.message })
		}

		console.log("[Cron] Successfully pinged Supabase:", data)
		return res.status(200).json({
			message: "Successfully pinged Supabase",
			timestamp: new Date().toISOString(),
		})
	} catch (error: any) {
		console.error("[Cron] Unexpected error during keep-alive:", error)
		return res.status(500).json({ message: "Unexpected error", error: error?.message || String(error) })
	}
}
