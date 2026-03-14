import React from 'react'
import Navigation from './Navigation'
import Footer from './Footer'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { ContactData } from '@/types/contact'
import SideWidget from './SideWidget'

type Props = {
  children: React.ReactNode
}

const Layout = async ({ children }: Props) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  // Fetch contact information from Payload CMS
  const fetchContactInfo = async (): Promise<ContactData | null> => {
    try {
      const result = await payload.findGlobal({
        slug: 'contactInfo',
        draft,
        overrideAccess: draft,
      })

      return result || null
    } catch (error) {
      console.error('Error fetching contact info:', error)
      return null
    }
  }

  const fetchAvailableMakesAndModels = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/available-makes-models`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (err) {
      console.error('Failed to fetch available makes and models:', err)
      return { makes: [], models: [] }
    }
  }

  const promotionsPage = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      template: {
        equals: 'promotions',
      },
    },
  })

  const promotions = promotionsPage.docs[0]?.promotionsContent

  const contactData = await fetchContactInfo()
  const { makes, models } = await fetchAvailableMakesAndModels()

  return (
    <>
      <Navigation contactData={contactData} isPromotionsEnabled={true} makes={makes || []} models={models || []} />
      {children}
      <Footer contactData={contactData} makes={makes} models={models} />
      <SideWidget contactData={contactData} makes={makes} models={models} />
    </>
  )
}

export default Layout