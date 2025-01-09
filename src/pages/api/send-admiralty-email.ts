import type { NextApiRequest, NextApiResponse } from "next"

import { createClient } from "@supabase/supabase-js"
import nodemailer from "nodemailer"

const supabaseUrl = "https://mxjkwzbcgefwdwifpgaz.supabase.co"
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" })
	}

	const { to, cc, bcc, subject = "Admiralty Document Folder Structure v2", inReplyTo = null, references = null, sendAt = null } = req.body

	// Handle multiple recipients for 'to' field
	const toRecipients = Array.isArray(to) ? to.join(", ") : to
	// Handle optional CC field
	const ccRecipients = cc ? (Array.isArray(cc) ? cc.join(", ") : cc) : undefined
	// Handle optional BCC field
	const bccRecipients = bcc ? (Array.isArray(bcc) ? bcc.join(", ") : bcc) : undefined

	if (!toRecipients) {
		return res.status(400).json({ message: "At least one recipient email is required" })
	}

	try {
		const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
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
            border-radius: 8px;
            overflow-x: auto;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            font-size: 14px;
            border: 1px solid #e0e0e0;
            font-family: "Consolas", "Monaco", monospace;
            white-space: pre;
            line-height: 1.4;
        }
        h1, h2 {
            color: #2c3e50;
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
            border-bottom: 2px solid #3498db;
            padding-bottom: 0.3em;
        }
        .section {
            background-color: #f8f9fa;
            padding: 25px 30px;
            margin: 30px 0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .principles { border-left: 4px solid #e74c3c; }
        .benefits { border-left: 4px solid #27ae60; }
        .notes { border-left: 4px solid #f39c12; }
        .methodology { border-left: 4px solid #3498db; }
        ul, ol { padding-left: 1.5em; margin-bottom: 20px; }
        ul ul { margin-bottom: 5px; margin-top: 5px; }
        li { margin-bottom: 0.4em; }
        .methodology ol > li { margin-bottom: 1em; }
        .methodology ul { margin-top: 0.3em; }
        strong { color: #2c3e50; }
        .greeting { margin-bottom: 2em; }
        .signature { margin-top: 2em; }
    </style>
</head>
<body>
    <div class="greeting">
        Hello,<br><br>
        
				I've reorganized the folder structure into five main categories to make file location more intuitive and reduce duplication. I've also added the following sections to handle documents that weren't properly organized before:

        <ul style="margin-left: 1.5em;">
            <li>Staff & HR (employee files, duties, shift reports, training)</li>
            <li>Building Documentation (plans, specifications, permits, warranties)</li>
            <li>Owner Communications (notices, surveys, information sessions)</li>
            <li>Building Maintenance (schedules, inspections, service records)</li>
        </ul>
				I'd also like to note that I used an offline LLM when parsing the list of files to ensure security and privacy.
    </div>

		<h2>Refined Folder Structure</h2>

    <pre>/Admiralty Strata VR1688/
├── Governance/
│   ├── Annual General Meetings/
│   │   ├── YYYY/
│   │   │   ├── Minutes
│   │   │   ├── Budget Package/
│   │   │   │   ├── Financial Statements
│   │   │   │   ├── Proposed Budget
│   │   │   │   ├── Explanatory Notes
│   │   │   │   └── Voting Materials/
│   │   │   └── Attendance Lists
│   │   └── Templates/
│   ├── Council Meetings/
│   │   ├── YYYY/
│   │   │   ├── Regular Meetings/
│   │   │   └── Emergency Meetings/
│   │   └── Templates/
│   ├── Bylaws/
│   └── Policies/
│
├── Operations/
│   ├── Staff & HR/
│   │   ├── Employee Files/
│   │   ├── Staff Duties/
│   │   ├── Shift Reports/
│   │   └── Training Materials/
│   ├── Building Maintenance/
│   │   ├── Schedules/
│   │   ├── Inspection Reports/
│   │   ├── Service Records/
│   │   └── Winterization Records/
│   └── Contracts/
│       ├── Elevator/
│       ├── Fire Safety/
│       ├── Maintenance/
│       └── Waste Management/
│
├── Financial/
│   ├── Banking/
│   │   ├── Deposit Slips/
│   │   ├── Bank Statements/
│   │   └── Accounting Procedures/
│   ├── Vendor Accounts/
│   │   ├── Invoices/
│   │   └── Payment Records/
│   ├── Insurance/
│   │   └── YYYY/
│   └── Annual Records/
│       └── YYYY/
│
├── Property/
│   ├── Building Documentation/
│   │   ├── Building Plans/
│   │   ├── Permits/
│   │   └── Warranties/
│   ├── Units/
│   │   └── Suite ###/
│   │       ├── Correspondence
│   │       ├── Forms History/
│   │       ├── Renovation Records
│   │       └── Incident Reports
│   └── Capital Projects/
│       ├── Planning/
│       └── Project Files/
│
└── Communications/
    ├── Owner Communications/
    │   ├── Notices/
    │   ├── Surveys/
    │   ├── General Correspondence/
    │   └── Information Sessions/
    └── Templates/
        ├── Letterhead
        └── Forms</pre>

		<div class="section principles">
        <h2>Key Organizational Principles</h2>
        <ul>
            <li><strong>Functional Hierarchy:</strong> Five main categories (Governance, Operations, Financial, Property, Communications) create clear divisions of responsibility</li>
            <li><strong>Chronological Consistency:</strong> Year-based organization (YYYY) for recurring documents like meetings, insurance, and financial records</li>
            <li><strong>Package Integrity:</strong> Related documents remain grouped (e.g., AGM packages, Building Documentation) rather than split by type</li>
            <li><strong>Centralized Templates:</strong> Templates consolidated under Communications to prevent duplication across departments</li>
            <li><strong>Logical Grouping:</strong> Similar functions combined under parent folders (e.g., all maintenance under Operations)</li>
        </ul>
    </div>

    <div class="section methodology">
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
                    <li>Grouped similar files together based on names and locations</li>
                    <li>Selected representative files from each group</li>
                </ul>
            </li>
            <li>
                <strong>Structure Development:</strong>
                <ul>
                    <li>Used an LLM for initial category suggestions</li>
                    <li>Manually reviewed and refined the structure</li>
                    <li>Organized into logical groupings</li>
                </ul>
            </li>
        </ol>
    </div>

    <div class="signature">
        Regards,<br><br>
        Matt
    </div>
</body>
</html>`

		const emailData = {
			to: toRecipients,
			cc: ccRecipients,
			bcc: bccRecipients,
			subject,
			html: emailHtml,
			inReplyTo,
			references,
			status: "pending",
			createdAt: new Date().toISOString(),
		}

		// If scheduled for later, store in database
		if (sendAt) {
			const scheduledTime = new Date(sendAt)
			const now = new Date()

			if (scheduledTime <= now) {
				return res.status(400).json({ message: "Scheduled time must be in the future" })
			}

			const { error } = await supabase.from("scheduled_emails").insert([
				{
					...emailData,
					sendAt: scheduledTime.toISOString(),
				},
			])

			if (error) throw error

			return res.status(200).json({
				message: "Email scheduled successfully",
				scheduledFor: scheduledTime.toISOString(),
			})
		}

		// Send immediately if no schedule
		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: parseInt(process.env.SMTP_PORT || "587"),
			secure: process.env.SMTP_SECURE === "true",
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		})

		await transporter.sendMail({
			from: process.env.SMTP_FROM,
			...emailData,
		})

		res.status(200).json({ message: "Email sent successfully" })
	} catch (error) {
		console.error("Error handling email:", error)
		res.status(500).json({ message: "Error handling email", error: error.message })
	}
}
