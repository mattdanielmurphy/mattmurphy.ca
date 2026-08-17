import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL || process.env.SUPABASE_URL,
})

export default async function handler(req, res) {
	if (req.method !== "GET") {
		res.setHeader("Allow", ["GET"])
		return res.status(405).end(`Method ${req.method} Not Allowed`)
	}

	const { address } = req.query
	if (!address) return res.status(400).json({ error: "No address provided" })

    try {
        await pool.query('DELETE FROM "zoho-spam-filter" WHERE address = $1', [address])
        console.log(`Removed ${address} from zoho spam filter`)
        res.status(200).end()
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}
