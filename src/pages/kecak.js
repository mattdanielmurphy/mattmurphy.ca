import Head from "next/head"
import { useEffect, useRef, useState } from "react"
import styles from "@/styles/Kecak.module.css"

export default function Kecak() {
	const [showCallout, setShowCallout] = useState(true)
	const hideTimeoutRef = useRef(null)

	useEffect(() => {
		let isMounted = true

		function onPlayerReady(event) {
			const player = event.target
			try {
				const quality = player.getPlaybackQuality?.()
				if (quality === "hd2160") {
					setShowCallout(false)
				}
			} catch (_) {}
		}

		function onPlayerPlaybackQualityChange(event) {
			try {
				if (event.data === "hd2160") {
					setShowCallout(false)
				}
			} catch (_) {}
		}

		function onPlayerStateChange(event) {
			try {
				const player = event.target
				const quality = player.getPlaybackQuality?.()
				if (quality === "hd2160") {
					setShowCallout(false)
					return
				}

				// YT.PlayerState.PLAYING is 1
				if (event.data === 1) {
					if (!hideTimeoutRef.current) {
						hideTimeoutRef.current = setTimeout(() => {
							if (isMounted) setShowCallout(false)
						}, 5000)
					}
				} else if (event.data === 2) {
					// Paused
					if (hideTimeoutRef.current) {
						clearTimeout(hideTimeoutRef.current)
						hideTimeoutRef.current = null
					}
				}
			} catch (_) {}
		}

		function initPlayer() {
			if (!window.YT || !window.YT.Player) return
			new window.YT.Player("kecak-player", {
				events: {
					onReady: onPlayerReady,
					onPlaybackQualityChange: onPlayerPlaybackQualityChange,
					onStateChange: onPlayerStateChange,
				},
			})
		}

		if (window.YT && window.YT.Player) {
			initPlayer()
		} else {
			const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
			if (!existingScript) {
				const tag = document.createElement("script")
				tag.src = "https://www.youtube.com/iframe_api"
				document.body.appendChild(tag)
			}
			const prevCallback = window.onYouTubeIframeAPIReady
			window.onYouTubeIframeAPIReady = () => {
				if (typeof prevCallback === "function") prevCallback()
				initPlayer()
			}
		}

		return () => {
			isMounted = false
			if (hideTimeoutRef.current) {
				clearTimeout(hideTimeoutRef.current)
			}
		}
	}, [])

	return (
		<>
			<Head>
				<title>Kecak | Matthew Daniel Murphy</title>
				<meta name="robots" content="noindex, nofollow" />
			</Head>
			<main className={styles.main}>
				<div className={styles.container}>
					{showCallout && (
						<div className={styles.callout}>
							<span>Please increase quality to 4k!</span>
							<span className={styles.arrow} aria-hidden="true">↘</span>
						</div>
					)}
					<div className={styles.videoWrapper}>
						<iframe
							id="kecak-player"
							className={styles.iframe}
							src="https://www.youtube.com/embed/ZDCcfnIMYr8?enablejsapi=1&vq=hd2160&rel=0"
							title="Kecak"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowFullScreen
						/>
					</div>
				</div>
			</main>
		</>
	)
}
