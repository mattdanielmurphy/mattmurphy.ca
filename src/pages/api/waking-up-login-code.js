import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://mxjkwzbcgefwdwifpgaz.supabase.co"
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
export default async function handler(req, res) {
	// Check if the request method is GET
	if (req.method === "GET") {
		const { subject } = req.query.params
		if (subject) {
			const loginCode = decodeURI(subject).match(/\d*/)
			if (loginCode) {
				const { data, error } = await supabase.from("codes").insert([{ loginCode }]).select()
				if (error) console.log(error)
				console.log(data)
				res.status(200).json({ data })
			}
		} else {
			const rows = await supabase.from("codes").select("*")
			res.status(200).json({ rows })
		}
	} else {
		// Handle any other HTTP method
		res.setHeader("Allow", ["GET"])
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}
