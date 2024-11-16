import { useEffect, useState } from "react"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://mxjkwzbcgefwdwifpgaz.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Codes() {
	const [codes, setCodes] = useState([])
	const [connectionError, setConnectionError] = useState(false)
	const [showAll, setShowAll] = useState(false)

	const timeAgo = (dateString) => {
		const now = new Date()
		const createdAt = new Date(dateString)
		const seconds = Math.floor((now - createdAt) / 1000)
		let interval = Math.floor(seconds / 31536000)

		if (interval >= 1) return `${interval} year${interval === 1 ? "" : "s"} ago`
		interval = Math.floor(seconds / 2592000)
		if (interval >= 1) return `${interval} month${interval === 1 ? "" : "s"} ago`
		interval = Math.floor(seconds / 86400)
		if (interval >= 1) return `${interval} day${interval === 1 ? "" : "s"} ago`
		interval = Math.floor(seconds / 3600)
		if (interval >= 1) return `${interval} hour${interval === 1 ? "" : "s"} ago`
		interval = Math.floor(seconds / 60)
		if (interval >= 1) return `${interval} minute${interval === 1 ? "" : "s"} ago`
		return `${seconds} second${seconds === 1 ? "" : "s"} ago`
	}

	const formatCode = (code) => {
		return String(code).padStart(4, "0")
	}

	const getData = async () => {
		const { data: rows, error } = await supabase.from("codes").select("*")
		if (error) {
			console.error("Error fetching data:", error)
			setConnectionError(true)
			return
		}
		const sortedRows = rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
		const formattedData = sortedRows.map((row) => ({
			createdAt: row.created_at,
			code: formatCode(row.code),
		}))

		setCodes(formattedData)
		setConnectionError(false)
	}

	useEffect(() => {
		getData()

		const channel = supabase
			.channel("schema-db-changes")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "codes",
				},
				(payload) => {
					console.log("Change received!", payload)
					getData()
				}
			)
			.subscribe()

		channel.on("error", () => {
			setConnectionError(true)
		})

		const intervalId = setInterval(() => {
			setCodes((prevCodes) =>
				prevCodes.map((code) => ({
					...code,
					timeAgo: timeAgo(code.createdAt),
				}))
			)
		}, 1000)

		return () => {
			clearInterval(intervalId)
			supabase.removeChannel(channel)
		}
	}, [])

	const toggleShowAll = () => {
		setShowAll(!showAll)
	}

	return (
		<div style={{ textAlign: "center", display: "flex", flexDirection: "column" }}>
			<p style={{ marginBottom: "20px" }}>(This page updates automatically as new codes are added&mdash;no need to refresh)</p>
			{connectionError && <p style={{ color: "red" }}>Warning: Connection to the database has been lost. Please check your connection.</p>}
			<div style={{ margin: "0 auto" }}>
				{codes.length > 0 ? (
					<>
						<h3 style={{ textAlign: "left", fontSize: "2rem" }}>
							{codes[0].code} <span style={{ color: "grey", fontWeight: "300" }}>{timeAgo(codes[0].createdAt)}</span>
						</h3>
						<button onClick={toggleShowAll} style={{ margin: "10px 0" }}>
							{showAll ? "Hide" : "Show"} older codes
						</button>
						{showAll &&
							codes.slice(1).map((code, index) => (
								<h3 key={index} style={{ textAlign: "left", fontSize: "1.5rem" }}>
									{code.code} <span style={{ color: "grey", fontWeight: "300" }}>{timeAgo(code.createdAt)}</span>
								</h3>
							))}
					</>
				) : (
					<h1>Loading...</h1>
				)}
			</div>
		</div>
	)
}
