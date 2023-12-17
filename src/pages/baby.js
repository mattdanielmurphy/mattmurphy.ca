import { useEffect } from 'react'
export default function Baby() {
	useEffect(() => {
		window.location.replace('https://montessori-beginnings.vercel.app/')
	})
	return (
		<div>
			<h1>Baby</h1>
		</div>
	)
}