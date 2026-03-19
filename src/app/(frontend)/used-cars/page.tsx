
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import type { Page } from '@/payload-types'
import UsedCarsComponent from './_components'

const queryListingsPage = cache(async (): Promise<Page | null> => {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'pages',
      draft: (await draftMode()).isEnabled,
      where: {
        template: {
          equals: 'listings',
        },
      },
    })

    return result.docs?.[0] || null
  } catch (error) {
    return null
  }
})

export const metadata: Metadata = {
  title: 'Used Cars for Sale Nottingham | Quality Pre-Owned Vehicles | MYDV Autos',
  description: 'Browse our extensive collection of quality used cars in Nottingham. Premium vehicles from Audi, BMW, Mercedes, Ford & more. Finance available, part exchange welcome.',
  keywords: 'used cars for sale Nottingham, second hand cars Nottingham, pre-owned vehicles, car showroom Nottingham, car finance Nottingham, MYDV Autos',
  openGraph: {
    title: 'Used Cars for Sale Nottingham | MYDV Autos',
    description: 'Discover premium quality used cars in our Nottingham showroom. Expert valuations, finance options, and exceptional customer service.',
    type: 'website',
    locale: 'en_GB',
  },
}

export default async function UsedCarsPage() {
  let page: Page | null = null

  try {
    page = await queryListingsPage()
  } catch (error) {
    // continue with null page
  }

  return <UsedCarsComponent listingsData={null} />
}
