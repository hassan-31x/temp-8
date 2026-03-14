import React from 'react'

export const metadata = {
  title: 'Delivery | MWA autos',
  description: 'We offer a competitively priced delivery service at MWA autos.',
}

export default function DeliveryPage() {
  return (
    <main className="min-h-screen bg-[#111111] text-white pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[700px] flex items-center">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1920&q=80"
            alt="Car on a trailer"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-[1700px] mx-auto px-6 w-full mt-10 md:mt-20">
          <div className="bg-[#1a1a1a]/95 max-w-lg p-10 md:p-14 border border-white/5">
            <h1 className="text-3xl md:text-5xl tracking-[0.2em] font-light uppercase mb-6 leading-tight text-center">
              Delivery
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed font-light text-center">
              We offer a competitively priced delivery service at MWA autos so that you can buy and sell vehicles with us from anywhere in the UK.
            </p>
          </div>
        </div>
      </section>

      {/* Info Sections */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        
        <div className="mb-16">
          <h2 className="text-xl md:text-2xl tracking-widest uppercase mb-6">
            From Our Showroom Floor To Your Door
          </h2>
          <p className="text-sm text-zinc-400 font-light mb-4">
            Enquire today regarding our delivery charges for the UK mainland.
          </p>
          <p className="text-sm text-zinc-400 font-light">
            Competitive prices for nationwide delivery. Some more remote areas of the UK may incur an additional charge. Please ring for details.
          </p>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl tracking-widest uppercase mb-6">
            Selling A Car
          </h2>
          <p className="text-sm text-zinc-400 font-light mb-4">
            Selling a car but you don&apos;t think we&apos;ll be interested as you are miles away?
          </p>
          <p className="text-sm text-zinc-400 font-light mb-4">
            No problem, we are constantly picking up and delivering vehicles all over the UK and we can arrange collection of your vehicle.
          </p>
          <p className="text-sm text-zinc-400 font-light">
            If we want it, we&apos;ll pick it up. We can arrange payment by cash or bank transfer and we can arrange to pay off any outstanding Loan or Hire Purchase agreements.
          </p>
        </div>

      </section>
    </main>
  )
}