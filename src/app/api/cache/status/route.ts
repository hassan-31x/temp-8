import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Import the cache variables (this is a simple way to check cache status)
    // In a real application, you might want to implement this differently
    
    return NextResponse.json({
      message: 'Cache status endpoint',
      timestamp: new Date().toISOString(),
      note: 'Cache is managed by the listings API endpoint'
    })
  } catch (error) {
    console.error('Cache status error:', error)
    return NextResponse.json(
      { error: 'Failed to get cache status' },
      { status: 500 }
    )
  }
}
