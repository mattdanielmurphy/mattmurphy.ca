import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body;

  // Simple Spam Check: Honeypot
  if (body.website_url) { // Create a hidden field named 'website_url' in your frontend
     return res.status(200).json({ status: 'ok' }); // Pretend it worked
  }

  try {
		const from = 'Matt Murphy <onboarding@resend.dev>'
		// const from = 'Matt Murphy <matt@contact.mattmurphy.ca>'

    const [adminData, userData] = await Promise.all([
      // 1. Email to Matt (Admin)
      resend.emails.send({
        from,
        to: [process.env.CONTACT_FORM_EMAIL || 'delivered@resend.dev'],
        subject: `Inquiry from ${body.email}: ${body.message.substring(0, 50)}...`,
        text: body.message,
        reply_to: body.email,
      }),
      // 2. Confirmation Email to User
      resend.emails.send({
        from,
        to: [body.email],
        subject: 'Message Received - Matt Murphy',
        text: `Hi there,\n\nThanks for reaching out! I've received your message and will get back to you shortly.\n\nHere is a copy of your message:\n\n---\n${body.message}\n---\n\nBest,\nMatt`,
      })
    ]);
    
    return res.status(200).json({ admin: adminData, user: userData });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
