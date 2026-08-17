import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL || process.env.SUPABASE_URL,
})

export default async function handler(req, res) {
	if (req.method !== "GET") {
		res.setHeader("Allow", ["GET"])
		return res.status(405).end(`Method ${req.method} Not Allowed`)
	}

	let { address, textContainingAddress } = req.query
	if (!address && !textContainingAddress) return res.status(400).json({ error: "No address provided" })

	if (!address) {
		const extractedAddress = textContainingAddress.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
		if (extractedAddress) address = extractedAddress[0]
		console.log(`Extracted address from text: ${address}`)
	}

    try {
        await pool.query('INSERT INTO "zoho-spam-filter" (address) VALUES ($1) RETURNING *', [address])
        console.log(`Added ${address} to zoho spam filter`)
        res.status(200).end()
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}
