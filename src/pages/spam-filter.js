import { useCallback, useEffect, useState } from "react"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://mxjkwzbcgefwdwifpgaz.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Addresss() {
	const [addresss, setAddresss] = useState([])
	const [connectionError, setConnectionError] = useState(false)
	const [showAll, setShowAll] = useState(false)
	const [loading, setLoading] = useState(true)
	const [hover, setHover] = useState(false)
	const [isAdding, setIsAdding] = useState(false)
	const [newEmail, setNewEmail] = useState("")
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

	const getData = useCallback(async () => {
		const { data: rows, error } = await supabase.from("zoho-spam-filter").select("*")
		setLoading(false)
		if (error) {
			console.error("Error fetching data:", error)
			setConnectionError(true)
			return
		}
		const sortedRows = rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
		setAddresss(sortedRows)
		setConnectionError(false)
	}, [])

	useEffect(() => {
		getData()

		const channel = supabase
			.channel("schema-db-changes")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "zoho-spam-filter",
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
			setAddresss((prevAddresss) =>
				prevAddresss.map((address) => ({
					...address,
					timeAgo: timeAgo(address["created_at"]),
				}))
			)
		}, 1000)

		return () => {
			clearInterval(intervalId)
			supabase.removeChannel(channel)
		}
	}, [getData])

	useEffect(() => {
		const handleBlur = () => setHover(false)
		window.addEventListener("blur", handleBlur)

		return () => {
			window.removeEventListener("blur", handleBlur)
		}
	}, [])

	const handleDelete = async (address) => {
		if (confirm(`Are you sure you want to delete this address: ${address}?`)) {
			try {
				const response = await fetch("/api/zoho-spam-filter/remove?address=" + address)
				if (response.ok) {
					getData() // Refresh the list after deletion
				}
			} catch (error) {
				console.error("Error deleting address:", error)
			}
		}
	}

	const handleAdd = async (e) => {
		if (!newEmail) return

		try {
			const response = await fetch("/api/zoho-spam-filter/add?address=" + newEmail)
			if (response.ok) {
				setNewEmail("")
				setIsAdding(false)
				getData() // Refresh the list
			}
		} catch (error) {
			console.error("Error adding address:", error)
		}
	}

	return (
		<div
			style={{
				textAlign: "center",
				display: "flex",
				flexDirection: "column",
				height: "100vh",
				margin: "0 auto",
				padding: "2rem 0",
				maxHeight: "800px",
			}}
		>
			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					overflow: "auto",
				}}
			>
				<div style={{ margin: "0 auto" }}>
					{loading ? (
						<h2>Loading...</h2>
					) : addresss.length > 0 ? (
						addresss.map((address, index) => (
							<div key={index} style={{ display: "flex", alignItems: "center", flexDirection: "row", gap: "1rem" }}>
								<button
									onClick={() => handleDelete(address.address)}
									onMouseEnter={() => setHover(index)}
									onMouseLeave={() => setHover(null)}
									style={{
										padding: "0",
										color: "#ff4444",
										background: "none",
										border: "none",
										cursor: "pointer",
									}}
								>
									&ndash;
								</button>
								<h3 style={{ textAlign: "left", fontSize: "1.1rem", margin: 0, color: hover === index ? "#ff4444" : "inherit", transition: "color 0.3s ease" }}>{address.address}</h3>
								<span style={{ color: "grey", fontWeight: "300" }}>{timeAgo(address["created_at"])}</span>
							</div>
						))
					) : (
						<h2>No addresses in spam filter</h2>
					)}
					{isAdding ? (
						<input
							type='email'
							value={newEmail}
							onChange={(e) => setNewEmail(e.target.value)}
							onKeyUp={(e) => {
								if (e.key === "Enter" && !e.shiftKey) handleAdd()
							}}
							placeholder='Enter email address'
							required
							autoFocus
							style={{
								padding: "0.5rem",
								marginRight: "0.5rem",
								borderRadius: "4px",
								border: "1px solid #ccc",
							}}
						/>
					) : (
						<button
							onClick={() => setIsAdding(true)}
							style={{
								padding: "0",
								color: "#44ff44",
								background: "none",
								border: "none",
								cursor: "pointer",
							}}
						>
							+
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
