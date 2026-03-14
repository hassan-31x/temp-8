import React from 'react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Page } from '@/payload-types'

const queryWarrantyPage = cache(async (): Promise<Page | null> => {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'pages',
      draft: (await draftMode()).isEnabled,
      where: {
        template: {
          equals: 'warranty',
        },
      },
    })

    return result.docs?.[0] || null
  } catch (error) {
    return null
  }
})

export const metadata: Metadata = {
  title: 'Car Warranty - MWA Autos | Comprehensive Used Car Warranty Protection',
  description: 'Protect your used car with MWA Autos comprehensive warranty packages. Third party and in-house warranties available from £99. Covers any vehicle, any age.',
  keywords: 'car warranty Nottingham, used car warranty, vehicle protection, warranty cover, automotive warranty, car protection plan',
  openGraph: {
    title: 'Car Warranty - MWA Autos',
    description: 'Comprehensive warranty packages for used cars. Protection from £99 covering any vehicle, any age.',
    type: 'website',
    locale: 'en_GB',
  },
}

export default async function WarrantyPage() {
  let page: Page | null = null

  try {
    page = await queryWarrantyPage()
  } catch (error) {
    // continue with null page
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[700px] flex items-center">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1920&q=80"
            alt="Car steering wheel close up - Assurance"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-[1700px] mx-auto px-6 w-full mt-10 md:mt-20">
          <div className="bg-[#1a1a1a]/95 max-w-lg p-10 md:p-14 border border-white/5">
            <h1 className="text-3xl md:text-5xl tracking-[0.2em] font-light uppercase mb-6 leading-tight text-center">
              Warranty
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed font-light text-center">
              Drive away with complete peace of mind. Comprehensive third-party and in-house warranties available to protect your investment.
            </p>
          </div>
        </div>
      </section>

      {/* Info Sections */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        
        <div className="mb-16">
          <h2 className="text-xl md:text-2xl tracking-widest uppercase mb-6">
            Comprehensive Cover From £99
          </h2>
          <p className="text-sm text-zinc-400 font-light mb-4">
            At MWA Autos, we understand that buying a used car is a significant investment. That&apos;s why we offer comprehensive warranty packages designed to give you total peace of mind long after you leave our showroom.
          </p>
          <p className="text-sm text-zinc-400 font-light mb-4">
            We provide a range of tailored warranty options, including trusted third-party coverage and our very own in-house policies. Starting from just £99, you can ensure your vehicle is protected against unforeseen mechanical and electrical failures.
          </p>
          <p className="text-sm text-zinc-400 font-light">
            Our flexible plans are built to cover any vehicle, of any age, ensuring that no matter which car you choose from our site, you are fully supported on the road ahead.
          </p>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl tracking-widest uppercase mb-6">
            Why Choose Our Warranty?
          </h2>
          <ul className="text-sm text-zinc-400 font-light space-y-4 list-none">
            <li className="flex items-start gap-4 border-b border-white/10 pb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0"></span>
              <span>Available from just £99 with transparent pricing and absolutely no hidden fees.</span>
            </li>
            <li className="flex items-start gap-4 border-b border-white/10 pb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0"></span>
              <span>Flexible coverage options spanning both mechanical and electrical components so you&apos;re never caught off-guard.</span>
            </li>
            <li className="flex items-start gap-4 border-b border-white/10 pb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0"></span>
              <span>Policies built to suit any vehicle make, model, or age.</span>
            </li>
            <li className="flex items-start gap-4 border-b border-white/10 pb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0"></span>
              <span>Choose between top-tier third-party providers or our highly-rated in-house coverage for rapid claim resolution.</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0"></span>
              <span>Dedicated aftersales support to help you get back on the road safely and swiftly.</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}
