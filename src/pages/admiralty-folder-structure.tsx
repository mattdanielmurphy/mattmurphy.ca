/** @jsxImportSource react */
import Head from "next/head"

export default function AdmiraltyFolderStructure() {
	return (
		<>
			<Head>
				<title>Admiralty Document Organization Structure</title>
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<meta name='robots' content='nofollow' />
			</Head>

			<style jsx global>{`
				:root {
					--primary-color: #2c3e50;
					--accent-color: #3498db;
					--bg-color: #f8f9fa;
					--border-radius: 8px;
					--box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				}

				body {
					font-family: "Segoe UI", Arial, sans-serif;
					line-height: 1.7;
					max-width: 800px;
					margin: 0 auto;
					padding: 40px 20px;
					color: #333;
					background-color: #fff;
				}

				pre {
					background-color: #f5f5f5;
					padding: 20px;
					border-radius: var(--border-radius);
					overflow-x: auto;
					box-shadow: var(--box-shadow);
					font-size: 14px;
					border: 1px solid #e0e0e0;
				}

				h1,
				h2 {
					color: var(--primary-color);
					font-weight: 600;
				}

				h1 {
					font-size: 2.5em;
					text-align: center;
					margin-top: 1em;
					margin-bottom: 0.7em;
					line-height: 1.3;
				}

				h2 {
					font-size: 1.8em;
					margin-bottom: 0.7em;
					border-bottom: 2px solid var(--accent-color);
					padding-bottom: 0.3em;
				}

				.principles,
				.benefits,
				.notes,
				.methodology {
					background-color: var(--bg-color);
					padding: 25px 30px;
					margin: 30px 0;
					border-radius: var(--border-radius);
					box-shadow: var(--box-shadow);
					border: none;
				}

				.principles {
					border-left: 4px solid #e74c3c;
				}
				.benefits {
					border-left: 4px solid #27ae60;
				}
				.notes {
					border-left: 4px solid #f39c12;
				}
				.methodology {
					border-left: 4px solid var(--accent-color);
				}

				ul,
				ol {
					padding-left: 1.5em;
					margin-bottom: 20px;
				}

				ul ul {
					margin-bottom: 5px;
					margin-top: 5px;
				}

				li {
					margin-bottom: 0.4em;
				}

				.folder-structure {
					font-family: "Consolas", "Monaco", monospace;
					white-space: pre;
					line-height: 1.4;
				}

				.methodology ol > li {
					margin-bottom: 1em;
				}

				.methodology ul {
					margin-top: 0.3em;
				}

				strong {
					color: var(--primary-color);
				}

				@media (max-width: 768px) {
					body {
						padding: 20px 15px;
					}

					h1 {
						font-size: 2em;
					}

					h2 {
						font-size: 1.5em;
					}

					.principles,
					.benefits,
					.notes,
					.methodology {
						padding: 20px;
					}
				}
			`}</style>

			<main>
				<h1>
					Admiralty Document <br />
					Organization Structure
				</h1>

				<h2>Basic Structure</h2>
				<pre className='folder-structure'>
					{`/Admiralty Strata VR1688/
├── Annual General Meetings/
│   ├── YYYY/                    # One folder per year
│   │   ├── Minutes
│   │   ├── Budget Package/
│   │   │   ├── Financial Statements
│   │   │   ├── Proposed Budget
│   │   │   ├── Explanatory Notes
│   │   │   └── Voting Materials/
│   │   │       ├── Ballots
│   │   │       ├── Proxies
│   │   │       └── Nomination Forms
│   │   └── Attendance Lists
│   └── Templates/               # For reusable AGM documents
│
├── Council Meetings/
│   ├── YYYY/
│   │   ├── Regular Meetings/    # Monthly council meetings
│   │   └── Emergency Meetings/  # Urgent matters requiring immediate attention
│   └── Templates/
│
├── Units/
│   ├── Common Property/         # Issues affecting common areas
│   └── Suite ###/               # One folder per unit
│       ├── Correspondence
│       ├── Form B History
│       ├── Form F History
│       ├── Renovation Records
│       ├── Alteration Agreements
│       └── Incident Reports
│
├── Insurance/
│   └── YYYY/                    # Policies by year
│
├── Contracts and Quotes/
│   ├── Elevator/
│   ├── Fire Safety/
│   ├── Maintenance/
│   └── Waste Management/
│
├── Capital Projects/
│   ├── Planning/
│   │   ├── Depreciation Reports
│   │   └── Capital Plans
│   └── Project Files/
│       └── Project Name/        # e.g., "Elevator Upgrade 2015"
│
└── Administrative/
    ├── Templates/
    │   ├── Letterhead
    │   └── Forms
    ├── Bylaws/
    └── Policies/`}
				</pre>

				<div className='principles'>
					<h2>Key Organizational Principles</h2>
					<ul>
						<li>
							<strong>Chronological Organization:</strong> Most documents are organized by year first, then by type.
						</li>
						<li>
							<strong>Meeting Separation:</strong> Clear separation between AGM documents and regular council meetings.
						</li>
						<li>
							<strong>Budget Package Grouping:</strong> All AGM-related budget documents are grouped together in a logical package.
						</li>
						<li>
							<strong>Project Documentation:</strong> Dedicated space for capital projects (e.g., elevator quotes, capital planning reports).
						</li>
						<li>
							<strong>Templates:</strong> Separate storage for template documents that are reused year after year.
						</li>
					</ul>
				</div>

				<div className='benefits'>
					<h2>Benefits of this Structure</h2>
					<ul>
						<li>
							<strong>Scalability:</strong> Can easily add new years without restructuring
						</li>
						<li>
							<strong>Accessibility:</strong> Clear paths to find specific types of documents
						</li>
						<li>
							<strong>Consistency:</strong> Standardized location for each document type
						</li>
						<li>
							<strong>Historical Reference:</strong> Easy to locate historical documents by year
						</li>
						<li>
							<strong>Package Completeness:</strong> Related documents (like AGM packages) kept together
						</li>
					</ul>
				</div>

				<div className='notes'>
					<h2>Additional Notes</h2>
					<ul>
						<li>
							<strong>Emergency Meetings:</strong> These are council meetings called to address urgent matters that cannot wait for the next regular meeting (e.g., major repairs, security incidents,
							immediate safety concerns).
						</li>
						<li>
							<strong>Units Section:</strong> Provides a dedicated space for unit-specific documentation, including:
							<ul>
								<li>Form B (Information Certificate) history</li>
								<li>Form F (Payment Certificate) history</li>
								<li>Renovation and alteration records</li>
								<li>Unit-specific correspondence</li>
								<li>Incident reports related to specific units</li>
							</ul>
						</li>
						<li>
							<strong>Common Property:</strong> Separate folder under Units to track issues and maintenance related to common areas
						</li>
					</ul>
				</div>

				<div className='methodology'>
					<h2>How This Structure Was Generated</h2>
					<ol>
						<li>
							<strong>Initial Data Collection:</strong>
							<ul>
								<li>Searched all document and image files on the Admiralty laptop</li>
								<li>Generated a comprehensive list of 8,037 file paths</li>
								<li>Saved all paths to a text file for analysis</li>
							</ul>
						</li>
						<li>
							<strong>Data Processing:</strong>
							<ul>
								<li>Created an analysis script to identify unique file patterns</li>
								<li>
									Script grouped similar files together based on:
									<ul>
										<li>Normalized filenames (removing numbers, dates, duplicate markers)</li>
										<li>Directory structures</li>
										<li>File extensions</li>
									</ul>
								</li>
								<li>Selected representative files from each group to create a manageable subset</li>
							</ul>
						</li>
						<li>
							<strong>Structure Development:</strong>
							<ul>
								<li>Fed the representative file list to an LLM for initial category suggestions</li>
								<li>Manually reviewed and refined the suggested structure</li>
								<li>Organized into logical groupings based on document types and relationships</li>
								<li>Added chronological organization where appropriate</li>
							</ul>
						</li>
					</ol>
				</div>
			</main>
		</>
	)
}
