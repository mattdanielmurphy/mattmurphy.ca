import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://mxjkwzbcgefwdwifpgaz.supabase.co"
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
	if (req.method !== "GET") {
		res.setHeader("Allow", ["GET"])
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}

	const { data, error } = await supabase.from("zoho-spam-filter").select("*")
	if (error) {
		console.log(error)
		res.status(500).json({ error })
	}
	const addresses = data.map((row) => row.address)
	res.status(200).json({ addresses })
}
