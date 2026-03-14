import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'

export async function GET() {
  try {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const result = await payload.findGlobal({
      slug: 'contactInfo',
      draft,
      overrideAccess: draft,
    })

    const contactData = result || null

    return NextResponse.json(contactData)
  } catch (error) {
    console.error('Error fetching contact info:', error)
    return NextResponse.json(null, { status: 500 })
  }
}
