import Link from "next/link"
import styles from "./Navbar.module.css"
import { useRouter } from "next/router"

export default function Navbar() {
	const router = useRouter()

	return (
		<nav className={styles.nav}>
			<div className={styles.container}>
				<Link href='/' className={styles.logo}>
					Matt Murphy
				</Link>
				<div className={styles.links}>
					<Link href='/' className={router.pathname === "/" ? styles.active : ""}>
						Work
					</Link>
					{/* Add About/Contact later if needed */}
				</div>
			</div>
		</nav>
	)
}
