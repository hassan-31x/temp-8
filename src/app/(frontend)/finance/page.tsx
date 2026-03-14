import React from 'react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import type { Page } from '@/payload-types'

const queryFinancePage = cache(async (): Promise<Page | null> => {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'pages',
      draft: (await draftMode()).isEnabled,
      where: {
        template: {
          equals: 'finance',
        },
      },
    })

    return result.docs?.[0] || null
  } catch (error) {
    return null
  }
})

export const metadata: Metadata = {
  title: 'Car Finance - MWA Autos | FCA Registered Finance from 9.9% APR',
  description: 'Get competitive car finance from MWA Autos. FCA registered lenders, quick approval process, and flexible terms from 9.9% APR. Apply for car finance online today.',
  keywords: 'car finance Nottingham, vehicle finance, HP finance, PCP finance, personal loan, FCA registered, competitive rates, finance approval',
  openGraph: {
    title: 'Car Finance - MWA Autos',
    description: 'Competitive car finance options from 9.9% APR. Quick approval and flexible terms available.',
    type: 'website',
    locale: 'en_GB',
  },
}

const FinancePage = async () => {
  let page: Page | null = null

  try {
    page = await queryFinancePage()
  } catch (error) {
    // continue with null page
  }

  return (
    <></>
  )
}

export default FinancePage