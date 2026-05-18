import Head from 'next/head'
import Layout from '@/components/Layout'
import Link from 'next/link'
import styles from './physics.module.css'
import fs from 'fs'
import path from 'path'

export async function getStaticProps() {
    const manifestPath = path.join(process.cwd(), 'public', 'physics-labs', 'manifest.json');
    let labs = [];
    try {
        if (fs.existsSync(manifestPath)) {
            const data = fs.readFileSync(manifestPath, 'utf8');
            labs = JSON.parse(data);
        }
    } catch (e) {
        console.error("Error reading manifest:", e);
    }
    
    return {
        props: {
            labs
        }
    }
}

export default function PhysicsLabsDirectory({ labs }) {
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
                    {labs.map(lab => (
                        <Link key={lab.slug} href={`/physics/${lab.slug}`}>
                            {lab.title}
                        </Link>
                    ))}
                </div>
            </div>
            <main className={styles.container}>
                <h1>Physics Labs</h1>
                <p className={styles.subtitle}>
                    A collection of physics lab reports and simulations.
                </p>

                <div className={styles.grid}>
                    {labs.map(lab => (
                        <Link key={lab.slug} href={`/physics/${lab.slug}`} className={styles.card}>
                            <h2>{lab.title}</h2>
                            <p>{lab.unit}</p>
                        </Link>
                    ))}
                    {labs.length === 0 && (
                        <p>No labs found. Please run the copy script.</p>
                    )}
                </div>
            </main>
        </>
    )
}
