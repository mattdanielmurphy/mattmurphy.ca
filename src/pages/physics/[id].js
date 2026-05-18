import Navbar from "@/components/Navbar"
import Head from "next/head"
import { useRouter } from "next/router"
import Link from "next/link"
import styles from "./physics.module.css"

export default function PhysicsLabViewer() {
	const router = useRouter()
	const { id } = router.query

	// Ensure we only load valid labs
	const validLabs = ["collision-forensics", "coulombs-law"]
	const isValid = validLabs.includes(id)

	if (!id) return null

	return (
		<>
			<Head>
				<title>{isValid ? `${id.replace("-", " ")} Lab` : "Lab Not Found"} | Matt Murphy</title>
			</Head>
			<div className={styles.physicsNavbar}>
				<Link href="/physics" className={styles.navLogo}>
					Physics Labs
				</Link>
				<div className={styles.navLinks}>
					<Link href="/physics/coulombs-law" className={id === 'coulombs-law' ? styles.active : ''}>
						Coulomb's Law
					</Link>
					<Link href="/physics/collision-forensics" className={id === 'collision-forensics' ? styles.active : ''}>
						Collision Forensics
					</Link>
				</div>
			</div>
			<div className={styles.viewerContainer}>
				{isValid ? (
					<iframe 
						src={`/physics-labs/${id}.html`} 
						className={styles.iframe}
						title={`Physics Lab: ${id}`}
					/>
				) : (
					<div className={styles.notFound}>
						<h2>Lab not found</h2>
						<p>The requested physics lab could not be found.</p>
					</div>
				)}
			</div>
		</>
	)
}
