import Head from 'next/head'
import Layout from '@/components/Layout'
import Link from 'next/link'
import styles from './physics.module.css'

export default function PhysicsLabsDirectory() {
    return (
        <>
            <Head>
                <title>Physics Labs | Matt Murphy</title>
            </Head>
            <div className={styles.physicsNavbar}>
                <Link href="/physics" className={styles.navLogo}>
                    Physics Labs
                </Link>
                <div className={styles.navLinks}>
                    <Link href="/physics/coulombs-law">Coulomb's Law</Link>
                    <Link href="/physics/collision-forensics">
                        Collision Forensics
                    </Link>
                </div>
            </div>
            <main className={styles.container}>
                <h1>Physics Labs</h1>
                <p className={styles.subtitle}>
                    A collection of physics lab reports and simulations.
                </p>

                <div className={styles.grid}>
                    <Link href="/physics/coulombs-law" className={styles.card}>
                        <h2>Coulomb's Law Virtual Lab</h2>
                        <p>Unit 5: Electricity</p>
                    </Link>

                    <Link
                        href="/physics/collision-forensics"
                        className={styles.card}
                    >
                        <h2>Collision Forensics</h2>
                        <p>Unit 4: Momentum</p>
                    </Link>
                </div>
            </main>
        </>
    )
}
