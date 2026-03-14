import { NextRequest, NextResponse } from 'next/server'
import { fetchAutoTraderListings, AutoTraderVehicle } from '@/utilities/autotrader'
import { extractMakesAndModelsFromVehicles } from '@/utilities/make-model'

// Cache for storing available makes and models
let availableMakesModelsCache: { makes: Array<{makeId: string, name: string}>, models: Array<{makeId: string, makeName: string, modelId: string, name: string}> } | null = null
let cacheTimestamp: number | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Fetch all listings and extract makes/models
async function fetchAvailableMakesAndModels() {
  // Check cache first
  if (availableMakesModelsCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    return availableMakesModelsCache
  }

  const allListings: AutoTraderVehicle[] = []
  let page = 1
  let hasMoreData = true
  const pageSize = 100

  try {
    while (hasMoreData) {
      const response = await fetchAutoTraderListings({
        page,
        pageSize
      })

      if (response.results && response.results.length > 0) {
        allListings.push(...response.results)
        
        const totalPages = Math.ceil(response.totalResults / pageSize)
        hasMoreData = page < totalPages
        page++
      } else {
        hasMoreData = false
      }
    }

    const result = extractMakesAndModelsFromVehicles(allListings)

    // Update cache
    availableMakesModelsCache = result
    cacheTimestamp = Date.now()

    return result
  } catch (error) {
    console.error('Error fetching available makes and models from AutoTrader:', error)
    
    // Fallback to Payload data
    try {
      console.log('Falling back to Payload CMS for makes and models')
      const { fetchAllPayloadVehicles } = await import('@/utilities/payloadFallback')
      const payloadVehicles = await fetchAllPayloadVehicles()
      
      const result = extractMakesAndModelsFromVehicles(payloadVehicles)
      
      // Update cache with Payload data
      availableMakesModelsCache = result
      cacheTimestamp = Date.now()
      
      console.log(`Fallback: Extracted ${result.makes.length} makes and ${result.models.length} models from Payload CMS`)
      return result
    } catch (payloadError) {
      console.error('Payload fallback also failed for makes and models:', payloadError)
      // Return cached data if available, otherwise empty arrays
      return availableMakesModelsCache || { makes: [], models: [] }
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const result = await fetchAvailableMakesAndModels()
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Available makes and models API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch available makes and models' },
      { status: 500 }
    )
  }
}
