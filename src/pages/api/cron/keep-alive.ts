import { createClient } from "@supabase/supabase-js"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log("[Cron] Starting Supabase keep-alive ping at:", new Date().toISOString())

	// Verify the request is from Vercel Cron
	if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
		console.log("[Cron] Unauthorized keep-alive attempt")
		return res.status(401).json({ message: "Unauthorized" })
	}

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
	const supabaseKey = process.env.SUPABASE_KEY

	if (!supabaseUrl || !supabaseKey) {
		console.error("[Cron] Supabase configuration missing")
		return res.status(500).json({ message: "Supabase configuration missing" })
	}

	// Initialize the Supabase client
	const supabase = createClient(supabaseUrl, supabaseKey)

	try {
		// Perform a simple query to keep the database active
		const { data, error } = await supabase.from("zoho-spam-filter").select("count").limit(1)

		if (error) {
			throw error
		}

		console.log("[Cron] Supabase Ping Success")
		return res.status(200).json({
			message: "Database kept alive successfully",
			timestamp: new Date().toISOString(),
		})
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("[Cron] Supabase Connection Failed:", error)
		return res.status(500).json({ message: "Unexpected database error", error: message })
	}
}
