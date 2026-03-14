import React from 'react'
import { GoogleAnalytics } from '@next/third-parties/google'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'

export const Providers: React.FC<{
  children: React.ReactNode
}> = async ({ children }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const googleAnalyticsId = await payload.findGlobal({
    slug: 'googleAnalytics',
  })

  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <WishlistProvider>
          {process.env.NODE_ENV === 'production' && googleAnalyticsId?.googleAnalyticsId && (
            <GoogleAnalytics gaId={googleAnalyticsId?.googleAnalyticsId} />
          )}
          {children}
        </WishlistProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
