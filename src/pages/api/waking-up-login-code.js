import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL || process.env.SUPABASE_URL,
})

export default async function handler(req, res) {
    // Check if the request method is GET
    if (req.method === 'GET') {
        const { subject } = req.query
        console.log(subject)

        if (subject) {
            const matches = decodeURI(subject).match(/\d+/)
            console.log(matches)
            const loginCode = matches ? matches[0] : null

            if (loginCode) {
                try {
                    const result = await pool.query(
                        'INSERT INTO "waking-up-login-codes" (code) VALUES ($1) RETURNING *',
                        [loginCode]
                    )
                    console.log(result.rows)
                    res.status(200).json({ data: result.rows })
                } catch (error) {
                    console.log(error)
                    res.status(500).json({ error: error.message })
                }
            } else {
                res.status(200).end()
            }
        } else {
            try {
                const result = await pool.query('SELECT * FROM "waking-up-login-codes"')
                res.status(200).json({ data: result.rows })
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        }
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
