import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://mxjkwzbcgefwdwifpgaz.supabase.co"
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
	if (req.method !== "GET") {
		res.setHeader("Allow", ["GET"])
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}

	let { address, textContainingAddress } = req.query
	if (!address && !textContainingAddress) res.status(400).json({ error: "No address provided" })
	if (!address) {
		const extractedAddress = textContainingAddress.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
		if (extractedAddress) address = extractedAddress[0]
		console.log(`Extracted address from text: ${address}`)
	}

	const { error } = await supabase.from("zoho-spam-filter").insert([{ address }]).select()
	if (error) {
		console.log(error)
		res.status(500).json({ error })
	}
	console.log(`Added ${address} to zoho spam filter`)
	res.status(200).end()
}
