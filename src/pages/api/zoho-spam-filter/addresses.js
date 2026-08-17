import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL || process.env.SUPABASE_URL,
})

export default async function handler(req, res) {
	if (req.method !== "GET") {
		res.setHeader("Allow", ["GET"])
		return res.status(405).end(`Method ${req.method} Not Allowed`)
	}

    try {
        const result = await pool.query('SELECT * FROM "zoho-spam-filter"')
        const addresses = result.rows.map((row) => row.address)
        res.status(200).json({ addresses, data: result.rows })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}
