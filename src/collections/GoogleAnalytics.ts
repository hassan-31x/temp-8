import type { GlobalConfig } from 'payload'
import { authenticated } from '../access/authenticated'

export const GoogleAnalytics: GlobalConfig = {
  slug: 'googleAnalytics',
  label: 'Google Analytics',
  admin: {
    description: 'Manage Google Analytics for the website',
  },
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'googleAnalyticsId',
      type: 'text',
      label: 'Google Analytics ID (G-XXXXXXX)',
      admin: {
        description: 'Enter the Google Analytics ID (G-XXXXXXX)',
      },
    }
  ],
}
