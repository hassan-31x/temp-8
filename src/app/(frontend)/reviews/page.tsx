import React from 'react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Page } from '@/payload-types'

const queryReviewsPage = cache(async (): Promise<Page | null> => {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'pages',
      draft: (await draftMode()).isEnabled,
      where: {
        template: {
          equals: 'reviews',
        },
      },
    })

    return result.docs?.[0] || null
  } catch (error) {
    return null
  }
})

export const metadata: Metadata = {
  title: 'Customer Reviews - MWA Autos | Trusted Used Car Dealer Nottingham',
  description: 'Read genuine customer reviews for MWA Autos. See what our customers say about our quality used cars, exceptional service, and professional team in Nottingham.',
  keywords: 'customer reviews, MWA Autos reviews, car dealer reviews Nottingham, used car testimonials, customer feedback, quality service reviews',
  openGraph: {
    title: 'Customer Reviews - MWA Autos',
    description: 'Read what our customers say about MWA Autos - trusted used car dealer in Nottingham.',
    type: 'website',
    locale: 'en_GB',
  },
}

import { Star } from 'lucide-react'

const DUMMY_REVIEWS = [
  {
    id: 1,
    rating: 5,
    text: "Team were efficient, trustworthy, open and honest, I would happily sell to them again. I can't understand why you would use WeBuyAnyCar over these guys - madness!",
    isTruncated: false,
  },
  {
    id: 2,
    rating: 5,
    text: "Just completed the sale of my car through Motorway .To Riviera automotive. John who collected the car was very friendly, knowledgeable and sorted the payment out quickly. Great experience",
    isTruncated: false,
  },
  {
    id: 3,
    rating: 5,
    text: "Chris was excellent - as were all the team at Riviera. I have never had so many people come to me and ask if they could help ... not in a pushy sales sort of way - just checking we were being looked a",
    isTruncated: true,
  },
  {
    id: 4,
    rating: 5,
    text: "We just sold our Grenadier through Motorway to Riviera Automotives. They made the process extremely easy. John was the assessor who travelled down to inspect and take the car. He was super professiona",
    isTruncated: true,
  },
  {
    id: 5,
    rating: 5,
    text: "John was a nice guy - honest guy good review - reluctantly had to knock something off but the window failed on the day! He'll give you a fair price.",
    isTruncated: false,
  },
  {
    id: 6,
    rating: 5,
    text: "We sold our X5 M50d to Riviera Automotive via Motorway. Very smooth transaction. John the vehicle assessor came out to appraise the car. Great communication through the process with constant updates. ",
    isTruncated: true,
  }
]

const ReviewsPage = async () => {
  let page: Page | null = null

  try {
    page = await queryReviewsPage()
  } catch (error) {
    // continue with null page
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-[0.2em] font-light uppercase mb-6">
            REVIEWS
          </h1>
          <p className="text-sm md:text-base text-zinc-400 font-light">
            Read what our customers have to say about us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DUMMY_REVIEWS.map((review) => (
            <div key={review.id} className="bg-[#1a1a1a] p-8 md:p-10 border border-white/5">
              <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < review.rating ? 'fill-white text-white' : 'fill-transparent text-zinc-600'}`} 
                  />
                ))}
              </div>
              <p className="text-sm md:text-base text-zinc-400 font-light leading-relaxed">
                {review.text}
                {review.isTruncated && (
                  <>
                    <span>... </span>
                    <button className="font-semibold text-white hover:text-zinc-300 transition-colors">
                      Read More
                    </button>
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default ReviewsPage
