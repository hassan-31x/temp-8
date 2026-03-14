import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found | My Dealership View',
  description: 'The page you\'re looking for could not be found. Return to My Dealership View to explore our luxury vehicle collection.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-slate-900 opacity-20">404</h1>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to exploring our luxury vehicle collection.
        </p>
        <div className="space-x-4">
          <Link
            href="/"
            className="inline-block bg-[#44903C] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#8F8F8F] transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/vehicles"
            className="inline-block border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Browse Vehicles
          </Link>
        </div>
      </div>
    </div>
  )
}
