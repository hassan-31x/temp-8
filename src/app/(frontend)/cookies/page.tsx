import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How we use cookies on our platform.',
}

export default function CookiesPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-16 md:pt-40">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="text-lg space-y-8">
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
            <p className="text-gray-300">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
            <p className="text-gray-300">
              We use cookies to understand how you use our site, improve your experience, and tailor our marketing efforts. This includes essential cookies, analytics cookies, and advertising cookies.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">3. Managing Cookies</h2>
            <p className="text-gray-300">
              Most web browsers allow some control of most cookies through the browser settings. You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">4. Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about our use of cookies, please contact us at privacy@example.com.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
