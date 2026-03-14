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

export default async function PrivacyPage() {
  const { isEnabled: draft } = await draftMode()
  const url = '/privacy'

  const page = await queryPrivacyPage()

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
  const page = await queryPrivacyPage()

  if (page) {
    return generateMeta({ doc: page })
  }

  return {
    title: 'Privacy Policy - MWA Autos | Data Protection & Privacy',
    description: 'Learn how MWA Autos protects your personal data and privacy. Our commitment to GDPR compliance and transparent data handling practices.',
    keywords: 'privacy policy, data protection, GDPR, MWA Autos, personal data, privacy rights, data security',
    openGraph: {
      title: 'Privacy Policy - MWA Autos',
      description: 'Our commitment to protecting your privacy and personal data.',
      type: 'website',
      locale: 'en_GB',
    },
  }
}

const queryPrivacyPage = cache(async () => {
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
        equals: 'privacy',
      },
    },
  })

  return result.docs?.[0] || null
})
