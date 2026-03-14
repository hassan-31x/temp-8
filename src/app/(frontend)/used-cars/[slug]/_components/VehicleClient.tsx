'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Route,
  Fuel,
  GitBranch,
  Palette,
  Settings,
  Calendar,
  Gauge,
  Flag,
  Users,
  Activity,
} from 'lucide-react'
import { AutoTraderVehicle } from '@/utilities/autotrader'
import { Services } from '@/components/home/Services'

import {
  ReserveModal,
  CallUsModal,
  FinanceModal,
  PartExchangeModal,
  EmailModal,
} from './modals'

interface VehicleClientProps {
  vehicle: AutoTraderVehicle
}

export default function VehicleClient({ vehicle }: VehicleClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Modal States
  const [showReserve, setShowReserve] = useState(false)
  const [showCallUs, setShowCallUs] = useState(false)
  const [showFinance, setShowFinance] = useState(false)
  const [showPartExchange, setShowPartExchange] = useState(false)
  const [showEmail, setShowEmail] = useState(false)

  const make = vehicle.vehicle.make || vehicle.vehicle.standard?.make || ''
  const model = vehicle.vehicle.model || vehicle.vehicle.standard?.model || ''
  const derivative = vehicle.vehicle.derivative || vehicle.vehicle.standard?.derivative || ''
  
  const price = vehicle.adverts?.forecourtPrice?.amountGBP || vehicle.adverts?.retailAdverts?.suppliedPrice?.amountGBP
  const wasPrice = vehicle.adverts?.soldPrice?.amountGBP || null
  
  const images = vehicle.media?.images || []
  const hasImages = images.length > 0
  const activeImage = hasImages ? images[activeImageIndex].href : '/placeholder.svg'

  const nextImage = () => setActiveImageIndex((prev) => (prev + 1) % images.length)
  const prevImage = () => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))

  const calculateMonthlyPayment = (priceValue: number | null) => {
    if (!priceValue || priceValue <= 0) return 'N/A'
    const deposit = priceValue * 0.1
    const loanAmount = priceValue - deposit
    const monthlyRate = 0.099 / 12
    const numPayments = 60
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
    }).format(monthlyPayment)
  }

  const specs = [
    { label: 'MAKE', value: make, icon: null },
    { label: 'MODEL', value: model, icon: null },
    { label: 'MILEAGE', value: vehicle.vehicle.odometerReadingMiles ? `${new Intl.NumberFormat('en-GB').format(vehicle.vehicle.odometerReadingMiles)} MILES` : 'N/A', icon: Route },
    { label: 'FUEL TYPE', value: vehicle.vehicle.fuelType || vehicle.vehicle.standard?.fuelType || 'N/A', icon: Fuel },
    { label: 'TRANSMISSION', value: vehicle.vehicle.transmissionType || vehicle.vehicle.standard?.transmissionType || 'N/A', icon: GitBranch },
    { label: 'BASIC COLOUR', value: vehicle.vehicle.colour || vehicle.vehicle.standard?.colour || 'N/A', icon: Palette },
    { label: 'ENGINE SIZE', value: vehicle.vehicle.badgeEngineSizeLitres ? `${vehicle.vehicle.badgeEngineSizeLitres.toFixed(1)}L` : 'N/A', icon: Settings },
    { label: 'YEAR', value: vehicle.vehicle.yearOfManufacture ? vehicle.vehicle.yearOfManufacture.toString() : 'N/A', icon: Calendar },
    { label: 'MAXIMUM SPEED', value: vehicle.vehicle.topSpeedMPH ? `${vehicle.vehicle.topSpeedMPH} MPH` : 'N/A', icon: Gauge },
    { label: 'BHP', value: vehicle.vehicle.enginePowerBHP ? `${vehicle.vehicle.enginePowerBHP} BHP` : 'N/A', icon: Flag },
    { label: 'SEATS', value: vehicle.vehicle.seats ? vehicle.vehicle.seats.toString() : 'N/A', icon: Users },
    { label: 'MPG', value: vehicle.vehicle.fuelEconomyWLTPCombinedMPG || vehicle.vehicle.fuelEconomyNEDCCombinedMPG || 'N/A', icon: Activity },
  ]

  return (
    <main className="min-h-screen bg-[#111111] text-white pt-24 pb-0">
      <div className="max-w-350 mx-auto px-6">
        
        {/* Back Link */}
        <Link href="/used-cars" className="inline-flex items-center text-xs text-zinc-400 hover:text-white uppercase tracking-widest mb-10 transition-colors!">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Link>
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8 gap-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-light tracking-widest uppercase mb-1">
              {make} {model}
            </h1>
            <h2 className="text-sm md:text-base text-zinc-400 uppercase tracking-widest font-light leading-relaxed">
              {derivative}
            </h2>
          </div>
          
          <div className="flex flex-col lg:items-end shrink-0">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl md:text-5xl font-light">
                {price ? `£${new Intl.NumberFormat('en-GB').format(price)}` : 'POA'}
              </span>
              {wasPrice && (
                <span className="text-sm text-zinc-400 line-through">
                  Was £{new Intl.NumberFormat('en-GB').format(wasPrice)}
                </span>
              )}
            </div>
            <div className="text-sm tracking-widest text-zinc-400 text-right w-full">
              {price ? `£${calculateMonthlyPayment(price)} per month` : ''}
            </div>
          </div>
        </div>

        {/* Main Image & Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 mb-4">
          
          {/* Main Image */}
          <div className="relative aspect-16/10 lg:aspect-auto h-100 md:h-125 lg:h-150 bg-zinc-900 group">
            {hasImages ? (
              <img 
                src={activeImage} 
                alt={`${make} ${model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500">
                NO IMAGE AVAILABLE
              </div>
            )}
            
            {hasImages && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-black p-2 hover:bg-zinc-200 transition-colors!">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black p-2 hover:bg-zinc-200 transition-colors!">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

          </div>

          {/* Specs List */}
          <div className="flex flex-col text-xs tracking-widest bg-[#161616] p-6 lg:p-0 lg:bg-transparent">
            {specs.map((spec, index) => {
              const Icon = spec.icon
              return (
                <div key={index} className="flex justify-between items-center py-4 border-b border-white/10 last:border-0 uppercase lg:py-3 xl:py-4">
                  <div className="flex items-center gap-3 text-zinc-400">
                    {Icon ? <Icon className="w-4 h-4" /> : <div className="w-4 h-4" />}
                    {spec.label}
                  </div>
                  <div className="text-right text-white max-w-50 font-medium wrap-break-word ml-4 truncate">
                    {spec.value}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Horizontal Thumbnail Strip */}
        {hasImages && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-10 snap-x hide-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative h-20 md:h-24 aspect-4/3 shrink-0 snap-start transition-all! ${
                  idx === activeImageIndex ? 'ring-2 ring-white opacity-100' : 'opacity-50 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.href} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-4 mb-20 max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full justify-center">
            <button 
              onClick={() => setShowReserve(true)}
              className="bg-white text-black px-4 py-4 text-xs font-semibold tracking-widest lg:tracking-[0.2em] uppercase hover:bg-zinc-200 transition-colors! col-span-1 md:col-span-1"
            >
              RESERVE NOW
            </button>
            <button 
              onClick={() => setShowEmail(true)}
              className="border border-white/30 text-white px-2 py-4 text-[10px] lg:text-xs tracking-widest lg:tracking-[0.2em] uppercase hover:bg-white/10 transition-colors! col-span-1 md:col-span-1"
            >
              ENQUIRE ONLINE
            </button>
            <button 
              onClick={() => setShowCallUs(true)}
              className="border border-white/30 text-white px-2 py-4 text-[10px] lg:text-xs tracking-widest lg:tracking-[0.2em] uppercase hover:bg-white/10 transition-colors! col-span-1 md:col-span-1"
            >
              CALL US
            </button>
            </div>            

            <div className='grid grid-cols-2 gap-4 w-full justify-center'>
            <button 
              onClick={() => setShowFinance(true)}
              className="border border-white/30 text-white px-2 py-4 text-[10px] lg:text-xs tracking-widest lg:tracking-[0.2em] uppercase hover:bg-white/10 transition-colors! col-span-1 md:col-span-1"
            >
              FINANCE
            </button>
             <button 
               onClick={() => setShowPartExchange(true)}
               className="border border-white/30 text-white px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-white/10 transition-colors! w-full md:w-auto"
             >
              PART EXCHANGE
            </button>
          </div>
        </div>

        {/* Horizontal Image Gallery (2 Rows) */}
        {images.length > 1 && (
          <div className="mb-20">
            <div className="grid grid-rows-2 grid-flow-col gap-2 md:gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
              {images.slice(1).map((img, idx) => (
                <div key={idx} className="relative w-56 md:w-72 lg:w-80 aspect-4/3 snap-center bg-zinc-900 overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.href} className="w-full h-full object-cover transition-transform! duration-700! group-hover:scale-105" alt={`Detail ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description Section */}
        {vehicle.adverts?.retailAdverts?.description && (
          <div className="border border-white/10 p-8 md:p-12 mb-20 bg-[#161616]">
            <h3 className="text-xl md:text-2xl uppercase tracking-widest font-light mb-6">DESCRIPTION</h3>
            <div className="text-sm text-zinc-400 font-light leading-relaxed whitespace-pre-wrap">
              {vehicle.adverts.retailAdverts.description}
            </div>
          </div>
        )}

        {/* Visit Our Showroom / Map Section */}
        <div className="text-center mb-0 border-t border-white/10 pt-20">
          <h3 className="text-xl md:text-2xl uppercase tracking-widest font-light mb-4">VISIT OUR SHOWROOM</h3>
          <p className="text-sm text-zinc-400 font-light mb-8 max-w-2xl mx-auto px-4">
            Book a test drive on your next car, today. Based in Cleckheaton, West Yorkshire, just 2 minutes from Junction 26 of the M62.
          </p>
          <button className="bg-white text-black px-8 py-4 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-zinc-200 transition-colors! mb-12 inline-flex items-center gap-2">
            GET DIRECTIONS <ChevronRight className="w-4 h-4 ml-1" />
          </button>
          
          <div className="w-full h-75 md:h-125 relative overflow-hidden group">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2358.5422619730596!2d-1.7226456241031737!3d53.76101297232204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487be75529f7cfeb%3A0xc487a3cbdddb0b59!2sRiviera%20Automotive%20Ltd!5e0!3m2!1sen!2suk!4v1710087754321!5m2!1sen!2suk"
              className="absolute inset-0 w-full h-125"
              style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute inset-0 bg-transparent pointer-events-none group-hover:bg-white/5 transition-colors!"></div>
          </div>
        </div>
      </div>
      
      {/* Our Services Section */}
      <div className="mt-0">
        <Services />
      </div>

      {/* Modals */}
      {showReserve && (
        <ReserveModal
          vehicleMake={make}
          vehicleModel={model}
          vehicleReg={vehicle.vehicle.registration || ''}
          vehiclePrice={price}
          stockId={vehicle.metadata?.stockId}
          onClose={() => setShowReserve(false)}
        />
      )}
      {showCallUs && (
        <CallUsModal
          phoneNumber="01274 878888" // Example phone number
          vehicleMake={make}
          vehicleModel={model}
          vehicleReg={vehicle.vehicle.registration || ''}
          vehiclePrice={price}
          stockId={vehicle.metadata?.stockId}
          onClose={() => setShowCallUs(false)}
        />
      )}
      {showFinance && (
        <FinanceModal
          vehicleMake={make}
          vehicleModel={model}
          vehicleReg={vehicle.vehicle.registration || ''}
          vehiclePrice={price}
          stockId={vehicle.metadata?.stockId}
          onClose={() => setShowFinance(false)}
        />
      )}
      {showPartExchange && (
        <PartExchangeModal
          vehicleMake={make}
          vehicleModel={model}
          vehicleReg={vehicle.vehicle.registration || ''}
          vehiclePrice={price}
          stockId={vehicle.metadata?.stockId}
          onClose={() => setShowPartExchange(false)}
        />
      )}
      {showEmail && (
        <EmailModal
          emailAddress="sales@dealership.com" // Example email
          vehicleMake={make}
          vehicleModel={model}
          vehicleReg={vehicle.vehicle.registration || ''}
          vehiclePrice={price}
          stockId={vehicle.metadata?.stockId}
          onClose={() => setShowEmail(false)}
        />
      )}
    </main>
  )
}
