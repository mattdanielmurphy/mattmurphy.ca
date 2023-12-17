// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
  // redirect to https://google.com
  res.redirect(301, 'https://montessori-beginnings.vercel.app/')
}
