import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BOLT UBC - UBC\'s Largest Data Club',
  description: 'Empowering UBC students to harness the power of data through hands-on workshops, case competitions, and networking events.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
