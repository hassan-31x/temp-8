"use client"

import { Facebook, Instagram } from "lucide-react"
import Link from "next/link"
import { ContactData } from "@/types/contact"
import { Make, Model } from "@/utilities/types"

interface FooterProps {
  contactData?: ContactData | null
  makes: Make[]
  models: Model[]
}

export default function Footer({ contactData, makes, models }: FooterProps) {

  // Extract contact information with fallbacks
  const businessAddress = contactData?.businessAddress

  const primaryPhone =
    contactData?.phoneNumbers?.find((phone) => phone.isPrimary) ??
    contactData?.phoneNumbers?.[0]

  const secondaryPhone =
    contactData?.phoneNumbers?.find(
      (phone) => !phone.isPrimary && phone.number !== primaryPhone?.number
    ) ?? contactData?.phoneNumbers?.[1]

  const primaryEmail =
    contactData?.emailAddresses?.find((email) => email.isPrimary) ??
    contactData?.emailAddresses?.[0]

  // Fallback values
  const primaryPhoneNumber = primaryPhone?.number ?? "01274 299734"
  const emailAddress = primaryEmail?.email ?? "info@MYDVautosltd.co.uk"

  return (
    <footer className="bg-[#191919] text-white pt-16 mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-zinc-800">

          {/* Logo Area */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-3xl md:text-4xl tracking-[0.3em] font-light uppercase">
              MYDV
            </h2>
            <p className="text-[10px] tracking-[0.6em] text-zinc-400 mt-2 ml-1 uppercase">
              A U T O M O T I V E
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="col-span-1 flex flex-col space-y-4 text-[13px] tracking-widest font-semibold uppercase text-zinc-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/used-cars" className="hover:text-white transition-colors">Shop Vehicles</Link>
            <Link href="/sell-your-car" className="hover:text-white transition-colors">Sell Your Car</Link>
            <Link href="/part-exchange" className="hover:text-white transition-colors">Part Exchange</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
          </div>

          {/* Links Column 2 */}
          <div className="col-span-1 flex flex-col space-y-4 text-[13px] tracking-widest font-semibold uppercase text-zinc-300">
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Preferences</Link>
          </div>

          {/* Contact Area */}
          <div className="col-span-1 flex flex-col space-y-4">
            <h3 className="text-sm font-bold tracking-widest uppercase mb-1">Contact</h3>

            <p className="text-zinc-400 text-sm leading-relaxed">
              {businessAddress?.name ?? "MYDV Autos Ltd"} <br />
              {businessAddress?.street ?? "Premium Auto Centre"} <br />
              {businessAddress?.city ?? "Nottingham"},{" "}
              {businessAddress?.postcode ?? "NG1 1NG"}
            </p>

            <p className="text-2xl md:text-3xl font-bold mt-2">
              {primaryPhoneNumber}
            </p>

            <div className="flex gap-4 mt-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-zinc-500 flex items-center justify-center hover:border-white hover:text-white text-zinc-300 transition-all duration-300"
              >
                <Facebook className="w-[18px] h-[18px]" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full border border-zinc-500 flex items-center justify-center hover:border-white hover:text-white text-zinc-300 transition-all duration-300"
              >
                <Instagram className="w-[18px] h-[18px]" />
              </a>
            </div>
          </div>

        </div>

        {/* FCA Text Section */}
        <div className="py-8">
          <p className="text-sm text-zinc-400 leading-relaxed font-light">
            MYDV Automotive ltd is authorised and regulated by the Financial Conduct Authority, FRN: 779199.
            All finance is subject to status and income. Written quotation on request. We act as a credit broker
            not a lender. We work with a number of carefully selected credit providers who may be able to offer
            you finance for your purchase. We are only able to offer finance products from these providers.
          </p>
        </div>

      </div>

      {/* Bottom Legal / Copyright Section */}
      <div className="bg-[#222222] py-8 border-t border-zinc-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col space-y-8">

          {/* Row 1 */}
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-[13px] text-zinc-400 font-light">
            <span>MYDV Automotive</span>
            <span>Registered in England and Wales</span>
            <span>Company No. 17614346</span>
          </div>

          {/* Row 3 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-[13px] text-zinc-400 font-light pt-2">
            <div>
              <span>© {new Date().getFullYear()} All Rights Reserved Website by </span>
              <span className="text-white font-medium">MYDV Autos</span>
            </div>
            <span>FCA Number: 779199</span>
          </div>

        </div>
      </div>
    </footer>
  )
}