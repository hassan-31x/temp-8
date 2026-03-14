import { NextRequest, NextResponse } from 'next/server'
import { getActiveAffiliateId, getAllAffiliateIds } from '@/utilities/affiliateId'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'active') {
      // Get only the active affiliate ID
      const activeId = await getActiveAffiliateId()
      return NextResponse.json({ 
        success: true, 
        data: { dealerAffiliateId: activeId } 
      })
    } else {
      // Get all affiliate IDs
      const allIds = await getAllAffiliateIds()
      return NextResponse.json({ 
        success: true, 
        data: allIds 
      })
    }
  } catch (error) {
    console.error('Error in affiliate ID API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch affiliate IDs' 
      },
      { status: 500 }
    )
  }
}
