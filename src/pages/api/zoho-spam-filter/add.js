import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://mxjkwzbcgefwdwifpgaz.supabase.co"
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
	if (req.method !== "GET") {
		res.setHeader("Allow", ["GET"])
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}

	const { address } = req.query
	if (!address) res.status(400).json({ error: "No address provided" })

	const { error } = await supabase.from("zoho-spam-filter").insert([{ address }]).select()
	if (error) console.log(error)
	console.log(`Added ${address} to zoho spam filter`)
	res.status(200)
}