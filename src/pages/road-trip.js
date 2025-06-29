import { useEffect, useState } from 'react'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Generate slug function
const generateSlug = (str) => {
	if (!str) return ''
	str = str.replace(/^\s+|\s+$/g, '')
	str = str.toLowerCase()
	str = str
		.replace(/[^a-z0-9 -]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
	return str
}

export default function RoadTrip() {
	const [markdownContent, setMarkdownContent] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const loadMarkdown = async () => {
			try {
				const response = await fetch('/roadtrip.md')
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}
				const content = await response.text()
				setMarkdownContent(content)
			} catch (error) {
				console.error('Error loading markdown:', error)
				setError('Unable to load the road trip itinerary.')
				setMarkdownContent('# Error loading content\n\nUnable to load the road trip itinerary.')
			} finally {
				setLoading(false)
			}
		}

		loadMarkdown()
	}, [])

	// Handle anchor link clicks
	useEffect(() => {
		const handleAnchorClick = (e) => {
			if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
				e.preventDefault()
				const targetId = e.target.getAttribute('href').substring(1)
				const targetElement = document.getElementById(targetId)
				if (targetElement) {
					targetElement.scrollIntoView({ 
						behavior: 'smooth',
						block: 'start'
					})
				}
			}
		}

		document.addEventListener('click', handleAnchorClick)
		return () => document.removeEventListener('click', handleAnchorClick)
	}, [])

	if (loading) {
		return (
			<main style={{ minHeight: '100vh', padding: '2rem 0', backgroundColor: '#f9f9f9' }}>
				<div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
					<div style={{ animation: 'pulse 2s infinite' }}>
						<div style={{ height: '2rem', backgroundColor: '#e0e0e0', borderRadius: '4px', width: '33%', marginBottom: '1rem' }}></div>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
							<div style={{ height: '1rem', backgroundColor: '#e0e0e0', borderRadius: '4px' }}></div>
							<div style={{ height: '1rem', backgroundColor: '#e0e0e0', borderRadius: '4px', width: '83%' }}></div>
							<div style={{ height: '1rem', backgroundColor: '#e0e0e0', borderRadius: '4px', width: '67%' }}></div>
						</div>
					</div>
				</div>
			</main>
		)
	}

	if (error) {
		return (
			<main style={{ minHeight: '100vh', padding: '2rem 0', backgroundColor: '#f9f9f9' }}>
				<div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
					<article style={{ 
						backgroundColor: 'white', 
						borderRadius: '12px', 
						boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
						padding: '2.5rem',
						textAlign: 'center'
					}}>
						<h1 style={{ color: '#dc2626', marginBottom: '1rem' }}>Error Loading Content</h1>
						<p style={{ color: '#6b7280' }}>{error}</p>
					</article>
				</div>
			</main>
		)
	}

	return (
		<main style={{ minHeight: '100vh', padding: '2rem 0', backgroundColor: '#f9f9f9' }}>
			<div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
				<article style={{ 
					backgroundColor: 'white', 
					borderRadius: '12px', 
					boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
					padding: '2.5rem',
					fontSize: '1rem',
					lineHeight: '1.6',
					maxWidth: '100%'
				}}>
					<ReactMarkdown 
						remarkPlugins={[remarkGfm]}
						components={{
							h1: ({node, ...props}) => <h1 style={{ 
								fontSize: '2.5rem', 
								fontWeight: 'bold', 
								color: '#1a1a1a', 
								marginBottom: '1rem',
								marginTop: '0',
								textAlign: 'center'
							}} {...props} />,
							h2: ({node, ...props}) => <h2 style={{ 
								fontSize: '1.75rem', 
								fontWeight: 'bold', 
								color: '#2d2d2d', 
								marginBottom: '1.5rem', 
								marginTop: '2.5rem',
								borderBottom: '2px solid #e5e7eb',
								paddingBottom: '0.5rem'
							}} {...props} />,
							h3: ({node, children, ...props}) => {
								// Handle children array properly
								const childrenArray = Array.isArray(children) ? children : [children]
								const heading = childrenArray
									.flatMap((element) => {
										if (typeof element === 'string') {
											return element
										}
										if (element?.type !== undefined && typeof element.props?.children === 'string') {
											return element.props.children
										}
										return []
									})
									.join('')
								
								const slug = generateSlug(heading)
								
								return (
									<h3 
										id={slug}
										style={{ 
											fontSize: '1.25rem', 
											fontWeight: '600', 
											color: '#374151', 
											marginBottom: '1rem', 
											marginTop: '2rem',
											backgroundColor: '#f3f4f6',
											padding: '0.75rem 1rem',
											borderRadius: '6px',
											borderLeft: '4px solid #3b82f6'
										}} 
										{...props}
									>
										{children}
									</h3>
								)
							},
							h4: ({node, ...props}) => <h4 style={{ 
								fontSize: '1.125rem', 
								fontWeight: '500', 
								color: '#525252', 
								marginBottom: '0.75rem', 
								marginTop: '1.5rem' 
							}} {...props} />,
							p: ({node, ...props}) => <p style={{ 
								color: '#374151', 
								lineHeight: '1.7', 
								marginBottom: '1rem',
								maxWidth: '65ch'
							}} {...props} />,
							ul: ({node, ...props}) => <ul style={{ 
								listStyleType: 'disc', 
								paddingLeft: '1.5rem', 
								color: '#374151', 
								marginBottom: '1.5rem',
								maxWidth: '65ch'
							}} {...props} />,
							ol: ({node, ...props}) => <ol style={{ 
								listStyleType: 'decimal', 
								paddingLeft: '1.5rem', 
								color: '#374151', 
								marginBottom: '1.5rem',
								maxWidth: '65ch'
							}} {...props} />,
							li: ({node, ...props}) => <li style={{ 
								color: '#374151', 
								marginBottom: '0.5rem',
								lineHeight: '1.6'
							}} {...props} />,
							strong: ({node, ...props}) => <strong style={{ 
								fontWeight: '600', 
								color: '#1f2937' 
							}} {...props} />,
							em: ({node, ...props}) => <em style={{ 
								fontStyle: 'italic', 
								color: '#4b5563' 
							}} {...props} />,
							hr: ({node, ...props}) => <hr style={{ 
								border: 'none', 
								borderTop: '2px solid #e5e7eb', 
								margin: '2.5rem 0',
								width: '100%'
							}} {...props} />,
							blockquote: ({node, ...props}) => <blockquote style={{ 
								borderLeft: '4px solid #3b82f6', 
								paddingLeft: '1rem', 
								fontStyle: 'italic', 
								color: '#6b7280', 
								marginBottom: '1.5rem',
								backgroundColor: '#f8fafc',
								padding: '1rem',
								borderRadius: '6px'
							}} {...props} />,
							a: ({node, ...props}) => <a style={{
								color: '#3b82f6',
								textDecoration: 'none',
								borderBottom: '1px solid transparent',
								transition: 'border-bottom-color 0.2s ease'
							}} 
							onMouseEnter={(e) => e.target.style.borderBottomColor = '#3b82f6'}
							onMouseLeave={(e) => e.target.style.borderBottomColor = 'transparent'}
							{...props} />,
							table: ({node, ...props}) => <div style={{
								overflowX: 'auto',
								marginBottom: '2rem',
								borderRadius: '8px',
								border: '1px solid #e5e7eb'
							}}>
								<table style={{
									width: '100%',
									borderCollapse: 'collapse',
									backgroundColor: 'white'
								}} {...props} />
							</div>,
							thead: ({node, ...props}) => <thead style={{
								backgroundColor: '#f8fafc',
								borderBottom: '2px solid #e5e7eb'
							}} {...props} />,
							tbody: ({node, ...props}) => <tbody {...props} />,
							tr: ({node, ...props}) => <tr style={{
								borderBottom: '1px solid #f3f4f6'
							}} {...props} />,
							th: ({node, ...props}) => <th style={{
								padding: '0.75rem 1rem',
								textAlign: 'left',
								fontWeight: '600',
								color: '#374151',
								fontSize: '0.875rem',
								textTransform: 'uppercase',
								letterSpacing: '0.05em'
							}} {...props} />,
							td: ({node, ...props}) => <td style={{
								padding: '0.75rem 1rem',
								color: '#374151',
								fontSize: '0.875rem',
								borderBottom: '1px solid #f3f4f6'
							}} {...props} />,
						}}
					>
						{markdownContent}
					</ReactMarkdown>
				</article>
			</div>
		</main>
	)
}
