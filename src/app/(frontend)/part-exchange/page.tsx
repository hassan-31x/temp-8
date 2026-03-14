import React from 'react'
import PartExchangeForm from './PartExchangeForm'

export const metadata = {
  title: 'Part Exchange | MWA autos',
  description: 'Get a competitive valuation for your current vehicle at MWA autos.',
}

export default function PartExchangePage() {
  return (
    <main className="min-h-screen bg-[#111111] text-white pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[700px] flex items-center">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1920&q=80"
            alt="Handing over car keys"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-[1700px] mx-auto px-6 w-full mt-10 md:mt-20">
          <div className="bg-[#1a1a1a]/95 max-w-lg p-10 md:p-14 border border-white/5">
            <h1 className="text-3xl md:text-5xl tracking-[0.2em] font-light uppercase mb-6 leading-tight text-center">
              Part Exchange
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed font-light text-center">
              Upgrade your current vehicle effortlessly. Get a competitive, no-obligation valuation and put its value towards your next car.
            </p>
          </div>
        </div>
      </section>

      {/* Info & Form Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        
        <div className="mb-16">
          <h2 className="text-xl md:text-2xl tracking-widest uppercase mb-6">
            Transparent Pricing
          </h2>
          <p className="text-sm text-zinc-400 font-light mb-4">
            We understand that your current vehicle holds value, and we are committed to offering you a fair, transparent price based on real-time market data.
          </p>
          <p className="text-sm text-zinc-400 font-light mb-4">
            Whether you&apos;re looking to upgrade to one of our premium models or simply need a change, our part exchange process is designed to be seamless. We can even settle outstanding finance on your existing car.
          </p>
          <p className="text-sm text-zinc-400 font-light">
            Simply fill out the details of your vehicle below, and one of our dedicated team members will be in touch with a customized quote.
          </p>
        </div>

        {/* Valuation Form */}
        <PartExchangeForm />

      </section>
    </main>
  )
}
