import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative h-[80vh] md:h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Subtle top gradient overlay to ensure navigation text is visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
      
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover"
      >
        <source src="/All_Wheels_Rotating_Video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  )
}
