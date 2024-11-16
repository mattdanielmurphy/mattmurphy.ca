export default function handler(req, res) {
	// Check if the request method is GET
	if (req.method === "GET") {
		// Extract query parameters from the request
		const params = req.query

		// Send the parameters back in the response
		res.status(200).json({ receivedParams: params })
	} else {
		// Handle any other HTTP method
		res.setHeader("Allow", ["GET"])
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}
