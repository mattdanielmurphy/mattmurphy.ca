import { Pool } from "pg"
import type { NextApiRequest, NextApiResponse } from "next"

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL || process.env.SUPABASE_URL,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log("[Cron] Starting Postgres keep-alive ping at:", new Date().toISOString())

	// Verify the request is from Vercel Cron
	if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
		console.log("[Cron] Unauthorized keep-alive attempt")
		return res.status(401).json({ message: "Unauthorized" })
	}

	try {
		// Perform a simple query to keep the database active
		await pool.query('SELECT count(*) FROM "zoho-spam-filter" LIMIT 1')

		console.log("[Cron] Postgres Ping Success")
		return res.status(200).json({
			message: "Database kept alive successfully",
			timestamp: new Date().toISOString(),
		})
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("[Cron] Postgres Connection Failed:", error)
		return res.status(500).json({ message: "Unexpected database error", error: message })
	}
}
