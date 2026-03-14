import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Define the affiliate ID type
interface AffiliateIdDoc {
  id: string
  dealerAffiliateId: string
  isActive: boolean
  description?: string
  createdAt: string
  updatedAt: string
}

/**
 * Get the active dealer affiliate ID from the database
 * Falls back to environment variable if no active ID is found
 */
export async function getActiveAffiliateId(): Promise<string> {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const result = await payload.findGlobal({
      slug: 'affiliateId',
    })

    if (result?.affiliateIds?.length && result.affiliateIds.length > 0) {
      const doc = result.affiliateIds[0] as AffiliateIdDoc
      return doc.dealerAffiliateId
    }

    // Fallback to environment variable
    return process.env.NEXT_PUBLIC_DEALER_AFFILIATE_ID || '43697'
  } catch (error) {
    console.error('Error fetching active affiliate ID:', error)
    // Fallback to environment variable
    return process.env.NEXT_PUBLIC_DEALER_AFFILIATE_ID || '43697'
  }
}

/**
 * Get all affiliate IDs from the database
 */
export async function getAllAffiliateIds(): Promise<Array<{ id: string; dealerAffiliateId: string; isActive: boolean; description?: string }>> {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const result = await payload.findGlobal({
      slug: 'affiliateId',
    })

    return result?.affiliateIds?.map((doc: any) => ({
      id: doc.id,
      dealerAffiliateId: doc.dealerAffiliateId,
      isActive: doc.isActive || false,
      description: doc.description,
    })) || []
  } catch (error) {
    console.error('Error fetching affiliate IDs:', error)
    return []
  }
}
