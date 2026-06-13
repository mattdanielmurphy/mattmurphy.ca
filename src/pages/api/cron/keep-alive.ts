import { Client } from "pg"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log("[Cron] Starting direct Postgres keep-alive ping at:", new Date().toISOString())

	// Verify the request is from Vercel Cron
	if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
		console.log("[Cron] Unauthorized keep-alive attempt")
		return res.status(401).json({ message: "Unauthorized" })
	}

	// Ensure your connection string env variable is set in Vercel
	if (!process.env.SUPABASE_DATABASE_URL) {
		console.error("[Cron] Database connection string missing")
		return res.status(500).json({ message: "Database connection string missing" })
	}

	// Initialize the direct Postgres client
	const client = new Client({
		connectionString: process.env.SUPABASE_DATABASE_URL,
	})

	try {
		await client.connect()

		// A raw SQL query forces the Postgres engine to process compute, resetting the inactivity timer
		const result = await client.query("SELECT NOW();")

		await client.end()

		console.log("[Cron] Direct DB Ping Success:", result.rows[0])
		return res.status(200).json({
			message: "Database kept alive successfully",
			timestamp: result.rows[0].now,
		})
	} catch (error: unknown) {
		await client.end().catch(() => {})
		const message = error instanceof Error ? error.message : String(error)
		console.error("[Cron] Direct DB Connection Failed:", error)
		return res.status(500).json({ message: "Unexpected database error", error: message })
	}
}
