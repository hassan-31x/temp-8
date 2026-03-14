"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Menu, X, Phone } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navigation({ variant = 'page', className = '' }: any) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const pathname = usePathname()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Close sidebar on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const defaultBg = isScrolled || pathname !== '/' ? 'bg-black/95 backdrop-blur-md shadow-lg border-b border-white/5' : 'bg-transparent text-white'
  const navContainerStyle = `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${defaultBg} ${className}`

  // Desktop dropdown item styles
  const itemStyle = "px-6 py-4 text-xs tracking-widest uppercase bg-[#111111] text-zinc-300 hover:bg-white hover:text-black font-semibold transition-colors duration-200"

  const closeSidebar = () => setMobileOpen(false)

  return (
    <>
      <nav className={navContainerStyle}>
        <div className="max-w-[1700px] mx-auto px-6 h-24 flex items-center justify-between">

          {/* ── DESKTOP: LEFT NAV ── */}
          <div className="hidden md:flex items-center gap-8 text-[13px] tracking-widest font-semibold uppercase text-zinc-300">
            <Link href="/used-cars" className="hover:text-white transition-colors">
              Shop Vehicles
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative h-24 flex items-center"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-2 hover:text-white transition-colors uppercase cursor-pointer">
                Our Services
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`absolute top-full left-0 z-[100] transition-all duration-200
                ${activeDropdown === 'services' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible pointer-events-none translate-y-3'}`}>
                <div className="w-64 shadow-2xl overflow-hidden">
                  <div className="flex flex-col">
                    <Link href="/part-exchange"  className={itemStyle}>Part Exchange</Link>
                    <Link href="/delivery"       className={itemStyle}>Delivery</Link>
                    <Link href="/warranty"       className={itemStyle}>Warranty</Link>
                    <Link href="/accessories"    className={itemStyle}>Accessories</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── MOBILE: HAMBURGER (left) ── */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 text-white z-10"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* ── LOGO CENTER ── */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex flex-col items-center group">
              <h2 className="text-3xl md:text-4xl tracking-[0.3em] font-light text-white uppercase transition-transform! group-hover:scale-105! duration-500!">
                MYDV
              </h2>
              <p className="text-[9px] tracking-[0.7em] text-zinc-400 mt-1 ml-1 uppercase group-hover:text-zinc-300! transition-colors!">
                A U T O M O T I V E
              </p>
            </Link>
          </div>

          {/* ── DESKTOP: RIGHT NAV ── */}
          <div className="hidden md:flex items-center gap-8 text-[13px] tracking-widest font-semibold uppercase text-zinc-300">
            {/* About Us Dropdown */}
            <Link href="/reviews" className="hover:text-white transition-colors!">
              Reviews
            </Link>

            <Link href="/contact" className="hover:text-white transition-colors!">
              Contact Us
            </Link>
          </div>

          {/* ── MOBILE: CALL ICON (right) ── */}
          <a
            href="tel:+1234567890"
            className="md:hidden flex items-center justify-center w-10 h-10 text-white z-10"
            aria-label="Call us"
          >
            <Phone className="w-5 h-5" />
          </a>

        </div>
      </nav>

      {/* ── MOBILE OVERLAY ── */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity! duration-300! md:hidden
          ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* ── MOBILE SIDEBAR ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-[300px] max-w-[85vw] z-[70] bg-[#0a0a0a] flex flex-col
          transition-transform! duration-300! ease-in-out! md:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-6 h-24 border-b border-white/10 shrink-0">
          <Link href="/" onClick={closeSidebar} className="flex flex-col">
            <span className="text-xl tracking-[0.3em] font-light text-white uppercase">MYDV</span>
            <span className="text-[8px] tracking-[0.5em] text-zinc-500 uppercase mt-0.5">A U T O M O T I V E</span>
          </Link>
          <button onClick={closeSidebar} aria-label="Close menu" className="text-zinc-400 hover:text-white transition-colors!">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar nav items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {/* Home */}
          <Link
            href="/"
            onClick={closeSidebar}
            className="flex items-center px-6 py-4 text-[13px] tracking-widest uppercase font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors! border-b border-white/5"
          >
            Home
          </Link>

          {/* Shop Vehicles */}
          <Link
            href="/used-cars"
            onClick={closeSidebar}
            className="flex items-center px-6 py-4 text-[13px] tracking-widest uppercase font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors! border-b border-white/5"
          >
            Shop Vehicles
          </Link>

          {/* Our Services (nested) */}
          <div className="border-b border-white/5">
            <button
              onClick={() => setMobileExpanded(mobileExpanded === 'services' ? null : 'services')}
              className="w-full flex items-center justify-between px-6 py-4 text-[13px] tracking-widest uppercase font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors!"
            >
              Our Services
              <ChevronDown className={`w-4 h-4 transition-transform! duration-300! ${mobileExpanded === 'services' ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all! duration-300! ${mobileExpanded === 'services' ? 'max-h-96' : 'max-h-0'}`}>
              <div className="bg-[#111111]">
                <Link href="/part-exchange"  onClick={closeSidebar} className="flex items-center px-10 py-3 text-[11px] tracking-widest uppercase text-zinc-400 hover:text-white hover:bg-white/5 transition-colors! border-b border-white/5">Part Exchange</Link>
                <Link href="/delivery"       onClick={closeSidebar} className="flex items-center px-10 py-3 text-[11px] tracking-widest uppercase text-zinc-400 hover:text-white hover:bg-white/5 transition-colors! border-b border-white/5">Delivery</Link>
                <Link href="/warranty"       onClick={closeSidebar} className="flex items-center px-10 py-3 text-[11px] tracking-widest uppercase text-zinc-400 hover:text-white hover:bg-white/5 transition-colors! border-b border-white/5">Warranty</Link>
                <Link href="/accessories"    onClick={closeSidebar} className="flex items-center px-10 py-3 text-[11px] tracking-widest uppercase text-zinc-400 hover:text-white hover:bg-white/5 transition-colors! border-b border-white/5">Accessories</Link>
              </div>
            </div>
          </div>

          {/* About Us (nested) */}
          <Link
            href="/reviews"
            onClick={closeSidebar}
            className="flex items-center px-6 py-4 text-[13px] tracking-widest uppercase font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5"
          >
            Reviews
          </Link>

          {/* Contact */}
          <Link
            href="/contact"
            onClick={closeSidebar}
            className="flex items-center px-6 py-4 text-[13px] tracking-widest uppercase font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5"
          >
            Contact Us
          </Link>
        </nav>

        {/* Sidebar footer CTA */}
        <div className="px-6 py-6 border-t border-white/10 shrink-0">
          <a
            href="tel:+1234567890"
            className="flex items-center justify-center gap-3 w-full py-3 bg-white text-black text-[11px] tracking-widest uppercase font-bold hover:bg-zinc-200 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call Us Now
          </a>
        </div>
      </aside>
    </>
  )
}