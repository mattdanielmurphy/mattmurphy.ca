import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://mxjkwzbcgefwdwifpgaz.supabase.co"
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
export default async function handler(req, res) {
	// Check if the request method is GET
	if (req.method === "GET") {
		const { subject } = req.query
		if (subject) {
			const matches = decodeURI(subject).match(/\d+/)
			console.log(matches)
			console.log("hello?!")
			const loginCode = matches[0]

			if (loginCode) {
				const { data, error } = await supabase
					.from("waking-up-login-codes")
					.insert([{ code: loginCode }])
					.select()
				if (error) console.log(error)
				console.log(data)
				res.status(200).json({ data })
			}
			res.status(200).end()
		} else {
			const rows = await supabase.from("waking-up-login-codes").select("*")
			res.status(200).json({ data: rows.data })
		}
	} else {
		// Handle any other HTTP method
		res.setHeader("Allow", ["GET"])
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}
