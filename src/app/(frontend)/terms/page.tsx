import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PayloadRedirects } from '@/components/payload/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/payload/LivePreviewListener'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function TermsPage() {
  const { isEnabled: draft } = await draftMode()
  const url = '/terms'

  const page = await queryTermsPage()

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}


    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryTermsPage()

  if (page) {
    return generateMeta({ doc: page })
  }

  return {
    title: 'Terms and Conditions - MWA Autos | Used Car Dealer Nottingham',
    description: 'Read MWA Autos terms and conditions for purchasing used cars, finance agreements, warranties, and our commitment to customer service in Nottingham.',
    keywords: 'terms conditions, MWA Autos, used car terms, car finance terms, warranty terms, Nottingham car dealer',
    openGraph: {
      title: 'Terms and Conditions - MWA Autos',
      description: 'Terms and conditions for MWA Autos - trusted used car dealer in Nottingham.',
      type: 'website',
      locale: 'en_GB',
    },
  }
}

const queryTermsPage = cache(async () => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      template: {
        equals: 'terms',
      },
    },
  })

  return result.docs?.[0] || null
})
