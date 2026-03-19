import React from 'react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Page } from '@/payload-types'

const queryVacanciesPage = cache(async (): Promise<Page | null> => {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'pages',
      draft: (await draftMode()).isEnabled,
      where: {
        template: {
          equals: 'vacancies',
        },
      },
    })

    return result.docs?.[0] || null
  } catch (error) {
    return null
  }
})

export const metadata: Metadata = {
  title: 'Career Opportunities - MYDV Autos | Join Our Team in Nottingham',
  description: 'Join the MYDV Autos team! Explore current job vacancies at our family-run used car dealership in Nottingham. We offer competitive salaries and excellent career development opportunities.',
  keywords: 'jobs Nottingham, car sales jobs, automotive careers, MYDV Autos careers, sales executive jobs, mechanic jobs Nottingham',
  openGraph: {
    title: 'Career Opportunities - MYDV Autos',
    description: 'Join our growing team at MYDV Autos - exciting career opportunities in automotive sales and service.',
    type: 'website',
    locale: 'en_GB',
  },
}

const VacanciesPage = async () => {
  let page: Page | null = null

  try {
    page = await queryVacanciesPage()
  } catch (error) {
    // continue with null page
  }

  // @ts-ignore
  return <></>
}

export default VacanciesPage
