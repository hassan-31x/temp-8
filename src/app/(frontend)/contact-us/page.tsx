import React from 'react'
import Image from 'next/image'

export default function ContactUsPage() {
  return (
    <div className="bg-[#1C1C1C] min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[700px] bg-black">
        <Image
          src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2938&auto=format&fit=crop"
          alt="Contact Us Car Background"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 flex items-center mb-[-200px]">
          <div className="container mx-auto px-4 md:px-8">
            <div className="bg-[#1c1c1c] bg-opacity-95 p-8 md:p-12 max-w-lg shadow-xl">
              <h1 className="text-3xl md:text-5xl font-light tracking-widest text-white mb-6 uppercase text-center md:text-left">
                Contact
              </h1>
              <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed text-center md:text-left">
                Ready to explore your next vehicle? Contact Riviera Automotive. Our sales team is happy to assist you via phone, email, or WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full h-[400px] bg-zinc-800 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2358.5422619730596!2d-1.7226456241031737!3d53.76101297232204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487be75529f7cfeb%3A0xc487a3cbdddb0b59!2sRiviera%20Automotive%20Ltd!5e0!3m2!1sen!2suk!4v1710087754321!5m2!1sen!2suk"
          className="absolute inset-0 w-full h-[400px]"
          style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      {/* Info Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Address */}
          <div>
            <h2 className="text-xl tracking-wider uppercase font-light mb-8">
              Riviera Automotive<br />Address
            </h2>
            <div className="space-y-2 text-gray-300 font-light text-sm">
              <p>Unit B5</p>
              <p>Spenbeck Business Park</p>
              <p>Cleckheaton</p>
              <p>West Yorkshire</p>
              <p>BD19 4EW</p>
            </div>
          </div>

          {/* Telephone */}
          <div>
            <h2 className="text-xl tracking-wider uppercase font-light mb-8">
              Telephone
            </h2>
            <div className="space-y-4 text-gray-300 font-light text-sm">
              <p className="flex items-center gap-2">
                Telephone: <span className="text-white font-medium">01274 299734</span>
              </p>
              <p className="flex items-center gap-2">
                WhatsApp: <span className="text-white font-medium">07565 642401</span>
              </p>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h2 className="text-xl tracking-wider uppercase font-light mb-8">
              Opening Hours
            </h2>
            <div className="space-y-2 text-gray-300 font-light text-sm">
              <div className="flex justify-between">
                <span>Monday</span>
                <span>09:00-18:00</span>
              </div>
              <div className="flex justify-between">
                <span>Tuesday</span>
                <span>09:00-18:00</span>
              </div>
              <div className="flex justify-between">
                <span>Wednesday</span>
                <span>09:00-18:00</span>
              </div>
              <div className="flex justify-between">
                <span>Thursday</span>
                <span>09:00-18:00</span>
              </div>
              <div className="flex justify-between">
                <span>Friday</span>
                <span>09:00-18:00</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>09:00-17:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-zinc-800"></div>

      {/* Enquire Online Section */}
      <section className="container mx-auto px-4 py-20 max-w-4xl">
        <h2 className="text-2xl tracking-wider uppercase font-light mb-12 text-center md:text-left">
          Enquire Online
        </h2>
        
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400">First Name <span className="text-red-500">*</span></label>
              <input type="text" className="w-full bg-white p-3 text-black rounded-none outline-none focus:ring-1 focus:ring-gray-400" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400">Last Name <span className="text-red-500">*</span></label>
              <input type="text" className="w-full bg-white p-3 text-black rounded-none outline-none focus:ring-1 focus:ring-gray-400" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400">Email <span className="text-red-500">*</span></label>
              <input type="email" className="w-full bg-white p-3 text-black rounded-none outline-none focus:ring-1 focus:ring-gray-400" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400">Telephone <span className="text-red-500">*</span></label>
              <input type="tel" className="w-full bg-white p-3 text-black rounded-none outline-none focus:ring-1 focus:ring-gray-400" required />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400">Message</label>
            <textarea rows={6} className="w-full bg-white p-3 text-black rounded-none outline-none focus:ring-1 focus:ring-gray-400" />
          </div>

          <div className="space-y-4">
            <p className="text-sm font-light text-gray-300">We would love to stay in touch!</p>
            <p className="text-sm font-light text-gray-300 max-w-3xl">
              Communication from us might include, offers/latest news and new vehicle arrivals. We promise to never sell your data to any third parties. You can opt out of any communication from us by simply clicking &apos;unsubscribe&apos; at the bottom of any emails.
            </p>
            
            <div className="space-y-3">
              <p className="text-sm font-light text-gray-300">I would love to stay in touch <span className="text-red-500">*</span></p>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input type="radio" name="marketing" value="yes" className="accent-white" />
                  Yes
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input type="radio" name="marketing" value="no" className="accent-white" />
                  No
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="bg-white text-black font-medium tracking-wider px-8 py-3 text-sm hover:bg-gray-200 transition-colors uppercase">
            Send
          </button>

          <p className="text-xs text-zinc-600 font-light">
            This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
          </p>
        </form>
      </section>
    </div>
  )
}
