import '../styles/globals.css';
import { Poppins } from 'next/font/google'

const poppins = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Saathi',
  description: 'Find your next career opportunity with Saathi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.className} bg-black text-gray-100`}>{children}</body>
    </html>
  )
}

