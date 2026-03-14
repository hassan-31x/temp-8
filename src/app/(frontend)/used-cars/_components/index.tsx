'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AutoTraderVehicle } from '@/utilities/autotrader'
import { Make, Model } from '@/utilities/types'
import type { Page } from '@/payload-types'
import { generateVehicleSlug } from '@/utilities/formatVehicleData'

interface UsedCarsComponentProps {
  listingsData: Page | null
}

interface ListingsFilters {
  make: string
  model: string
  minPrice: string
  maxPrice: string
  minMileage: string
  maxMileage: string
  fuelType: string
  bodyType: string
  transmissionType: string
  minYear: string
  maxYear: string
}

type SortOrder = 'asc' | 'desc'
type SortBy = 'dateAdded' | 'price' | 'year' | 'mileage' | 'make' | 'model' | 'fuelType'

type ExtendedModel = Model & {
  makeName: string
}

export default function UsedCarsComponent({ listingsData }: UsedCarsComponentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [listings, setListings] = useState<AutoTraderVehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState(0)
  const pageSize = 20

  // Make and Model state
  const [makes, setMakes] = useState<Make[]>([])
  const [models, setModels] = useState<ExtendedModel[]>([])
  const [allModels, setAllModels] = useState<ExtendedModel[]>([])
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [showSortModal, setShowSortModal] = useState(false)
  const [draftFilters, setDraftFilters] = useState<ListingsFilters>({
    make: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    minMileage: '',
    maxMileage: '',
    fuelType: '',
    bodyType: '',
    transmissionType: '',
    minYear: '',
    maxYear: '',
  })
  const [draftSortBy, setDraftSortBy] = useState<SortBy>('dateAdded')
  const [draftSortOrder, setDraftSortOrder] = useState<SortOrder>('desc')

  // Get current page from URL params
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  const appliedSortBy = (searchParams.get('sortBy') as SortBy) || 'dateAdded'
  const appliedSortOrder = (searchParams.get('sortOrder') as SortOrder) || 'desc'

  // Get filters from URL params
  const getFiltersFromParams = useCallback((): ListingsFilters => {
    return {
      make: searchParams.get('make') || '',
      model: searchParams.get('model') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      minMileage: searchParams.get('minMileage') || '',
      maxMileage: searchParams.get('maxMileage') || '',
      fuelType: searchParams.get('fuelType') || '',
      bodyType: searchParams.get('bodyType') || '',
      transmissionType: searchParams.get('transmissionType') || '',
      minYear: searchParams.get('minYear') || '',
      maxYear: searchParams.get('maxYear') || ''
    }
  }, [searchParams])

  // Memoize filters so it doesn't cause infinite re-renders in useEffect
  const filters = useMemo(() => getFiltersFromParams(), [getFiltersFromParams])

  const totalPages = Math.ceil(totalResults / pageSize)

  const fetchListings = useCallback(async (page: number, currentFilters: ListingsFilters, currentSortBy: SortBy, currentSortOrder: SortOrder) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        sortBy: currentSortBy,
        sortOrder: currentSortOrder,
      })

      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        }
      })

      const response = await fetch(`/api/listings?${params.toString()}`, {
        method: 'GET',
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch listings (${response.status})`)
      }

      const data = await response.json()
      const incomingListings: AutoTraderVehicle[] = data.results || []
      const incomingMakes: Make[] = data.availableMakes || []
      const incomingModels: ExtendedModel[] = data.availableModels || []

      setListings(incomingListings)
      setTotalResults(data.totalResults || 0)
      setMakes(incomingMakes)
      setAllModels(incomingModels)

      if (currentFilters.make) {
        setModels(incomingModels.filter((model) => model.makeName === currentFilters.make))
      } else {
        setModels([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch listings')
      setListings([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }, [pageSize])

  // Load listings on component mount and when parameters change
  useEffect(() => {
    fetchListings(currentPage, filters, appliedSortBy, appliedSortOrder)
  }, [currentPage, appliedSortBy, appliedSortOrder, filters, fetchListings])

  useEffect(() => {
    if (!showFiltersModal) {
      return
    }

    setDraftFilters(filters)
    if (filters.make) {
      setModels(allModels.filter((model) => model.makeName === filters.make))
    } else {
      setModels([])
    }
  }, [showFiltersModal, filters, allModels])

  useEffect(() => {
    if (!showSortModal) {
      return
    }

    setDraftSortBy(appliedSortBy)
    setDraftSortOrder(appliedSortOrder)
  }, [showSortModal, appliedSortBy, appliedSortOrder])

  const updateURL = useCallback((newFilters: ListingsFilters, page = 1, newSortBy?: SortBy, newSortOrder?: SortOrder) => {
    const params = new URLSearchParams()

    // Add page parameter
    if (page > 1) {
      params.set('page', page.toString())
    }

    // Add sorting parameters
    const currentSortBy = newSortBy || appliedSortBy
    const currentSortOrder = newSortOrder || appliedSortOrder
    if (currentSortBy !== 'dateAdded') {
      params.set('sortBy', currentSortBy)
    }
    if (currentSortOrder !== 'desc') {
      params.set('sortOrder', currentSortOrder)
    }

    // Add filter parameters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    // Update URL
    const newURL = params.toString() ? `?${params.toString()}` : '/used-cars'
    router.push(newURL, { scroll: false })
  }, [router, appliedSortBy, appliedSortOrder])

  const handleDraftFilterChange = (key: keyof ListingsFilters, value: string) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleDraftMakeChange = (makeName: string) => {
    setDraftFilters((prev) => ({ ...prev, make: makeName, model: '' }))
    setModels(allModels.filter((model) => model.makeName === makeName))
  }

  const handleApplyModalFilters = () => {
    updateURL(draftFilters, 1, appliedSortBy, appliedSortOrder)
    setShowFiltersModal(false)
  }

  const handleApplySort = () => {
    updateURL(filters, 1, draftSortBy, draftSortOrder)
    setShowSortModal(false)
  }

  const handleClearFilters = () => {
    const clearedFilters: ListingsFilters = {
      make: '',
      model: '',
      minPrice: '',
      maxPrice: '',
      minMileage: '',
      maxMileage: '',
      fuelType: '',
      bodyType: '',
      transmissionType: '',
      minYear: '',
      maxYear: ''
    }
    setDraftFilters(clearedFilters)
    updateURL(clearedFilters, 1, appliedSortBy, appliedSortOrder)
    setModels([])
    setShowFiltersModal(false)
  }

  const handlePageChange = (page: number) => {
    updateURL(filters, page, appliedSortBy, appliedSortOrder)
  }

  const formatMileage = (mileage: number | null) => {
    if (!mileage) return 'Not specified'
    return new Intl.NumberFormat('en-GB').format(mileage) + ' m'
  }

  const calculateMonthlyPayment = (price: number | null) => {
    if (!price || price <= 0) return 'N/A'

    const deposit = price * 0.1 // 10% deposit
    const loanAmount = price - deposit
    const monthlyRate = 0.099 / 12 // 9.9% APR divided by 12 months
    const numPayments = 60 // 60 months

    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)

    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(monthlyPayment)
  }

  const sortOptions: Array<{ value: SortBy; label: string }> = [
    { value: 'dateAdded', label: 'Recently Added' },
    { value: 'price', label: 'Price' },
    { value: 'year', label: 'Year' },
    { value: 'mileage', label: 'Mileage' },
    { value: 'make', label: 'Make' },
    { value: 'model', label: 'Model' },
    { value: 'fuelType', label: 'Fuel Type' },
  ]

  const showResultsFrom = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const showResultsTo = Math.min(currentPage * pageSize, totalResults)
  const visiblePagination = Array.from({ length: totalPages }).slice(
    Math.max(0, currentPage - 3),
    Math.max(0, currentPage - 3) + 5,
  )

  return (
    <main className="min-h-screen bg-[#111111] text-white pt-24 pb-20">
      
      {/* Title */}
      <div className="text-center py-10">
        <h1 className="text-2xl md:text-3xl tracking-[0.2em] font-light uppercase">
          Shop Our Vehicles
        </h1>
      </div>

      {/* Filter and Order Buttons */}
      <div className="max-w-425 mx-auto px-6 grid grid-cols-2 gap-4 mb-8">
        <button 
          className="bg-white text-black py-4 text-xs font-semibold tracking-widest uppercase hover:bg-gray-200 transition-colors!"
          onClick={() => setShowFiltersModal(true)}
        >
          FILTER
        </button>
        <button 
          className="bg-zinc-500 text-white py-4 text-xs font-semibold tracking-widest uppercase hover:bg-zinc-600 transition-colors!"
          onClick={() => setShowSortModal(true)}
        >
          ORDER BY
        </button>
      </div>

      {/* Display Count */}
      <div className="text-center text-[10px] tracking-widest uppercase text-white mb-10 font-semibold">
        CURRENTLY DISPLAYING {showResultsFrom} - {showResultsTo} OF {totalResults}
      </div>

      {error && (
        <div className="max-w-425 mx-auto px-6 mb-6">
          <div className="border border-red-500/30 bg-red-500/10 p-4 text-xs tracking-wide uppercase text-red-300 text-center">
            {error}
          </div>
        </div>
      )}

      {/* Filters Modal */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl bg-[#161616] border border-white/10">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-sm tracking-[0.2em] uppercase">Filter Vehicles</h2>
              <button
                className="text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-white"
                onClick={() => setShowFiltersModal(false)}
              >
                Close
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-zinc-400 mb-2">Make</label>
                <select
                  className="w-full bg-[#111111] border border-white/10 px-3 py-3 text-xs uppercase tracking-wide"
                  value={draftFilters.make}
                  onChange={(e) => handleDraftMakeChange(e.target.value)}
                >
                  <option value="">All Makes</option>
                  {makes.map((make) => (
                    <option key={make.makeId} value={make.name}>{make.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-zinc-400 mb-2">Model</label>
                <select
                  className="w-full bg-[#111111] border border-white/10 px-3 py-3 text-xs uppercase tracking-wide"
                  value={draftFilters.model}
                  onChange={(e) => handleDraftFilterChange('model', e.target.value)}
                  disabled={!draftFilters.make}
                >
                  <option value="">All Models</option>
                  {models.map((model) => (
                    <option key={model.modelId} value={model.name}>{model.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-zinc-400 mb-2">Min Price (£)</label>
                <input
                  type="number"
                  className="w-full bg-[#111111] border border-white/10 px-3 py-3 text-xs uppercase tracking-wide"
                  value={draftFilters.minPrice}
                  onChange={(e) => handleDraftFilterChange('minPrice', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-zinc-400 mb-2">Max Price (£)</label>
                <input
                  type="number"
                  className="w-full bg-[#111111] border border-white/10 px-3 py-3 text-xs uppercase tracking-wide"
                  value={draftFilters.maxPrice}
                  onChange={(e) => handleDraftFilterChange('maxPrice', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-zinc-400 mb-2">Min Mileage</label>
                <input
                  type="number"
                  className="w-full bg-[#111111] border border-white/10 px-3 py-3 text-xs uppercase tracking-wide"
                  value={draftFilters.minMileage}
                  onChange={(e) => handleDraftFilterChange('minMileage', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-zinc-400 mb-2">Max Mileage</label>
                <input
                  type="number"
                  className="w-full bg-[#111111] border border-white/10 px-3 py-3 text-xs uppercase tracking-wide"
                  value={draftFilters.maxMileage}
                  onChange={(e) => handleDraftFilterChange('maxMileage', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-zinc-400 mb-2">Min Year</label>
                <input
                  type="number"
                  className="w-full bg-[#111111] border border-white/10 px-3 py-3 text-xs uppercase tracking-wide"
                  value={draftFilters.minYear}
                  onChange={(e) => handleDraftFilterChange('minYear', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-zinc-400 mb-2">Max Year</label>
                <input
                  type="number"
                  className="w-full bg-[#111111] border border-white/10 px-3 py-3 text-xs uppercase tracking-wide"
                  value={draftFilters.maxYear}
                  onChange={(e) => handleDraftFilterChange('maxYear', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-zinc-400 mb-2">Fuel Type</label>
                <select
                  className="w-full bg-[#111111] border border-white/10 px-3 py-3 text-xs uppercase tracking-wide"
                  value={draftFilters.fuelType}
                  onChange={(e) => handleDraftFilterChange('fuelType', e.target.value)}
                >
                  <option value="">All Fuel Types</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-zinc-400 mb-2">Body Type</label>
                <input
                  className="w-full bg-[#111111] border border-white/10 px-3 py-3 text-xs uppercase tracking-wide"
                  value={draftFilters.bodyType}
                  onChange={(e) => handleDraftFilterChange('bodyType', e.target.value)}
                  placeholder="SUV, Hatchback, Saloon"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-zinc-400 mb-2">Transmission</label>
                <select
                  className="w-full bg-[#111111] border border-white/10 px-3 py-3 text-xs uppercase tracking-wide"
                  value={draftFilters.transmissionType}
                  onChange={(e) => handleDraftFilterChange('transmissionType', e.target.value)}
                >
                  <option value="">All Transmissions</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
              <button
                className="text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-white"
                onClick={handleClearFilters}
              >
                Clear All
              </button>
              <button
                className="bg-white text-black text-xs px-6 py-3 tracking-[0.2em] uppercase font-semibold hover:bg-zinc-200"
                onClick={handleApplyModalFilters}
              >
                Confirm Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sort Modal */}
      {showSortModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-xl bg-[#161616] border border-white/10">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-sm tracking-[0.2em] uppercase">Order Vehicles</h2>
              <button
                className="text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-white"
                onClick={() => setShowSortModal(false)}
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-zinc-400 mb-2">Sort By</label>
                <select
                  className="w-full bg-[#111111] border border-white/10 px-3 py-3 text-xs uppercase tracking-wide"
                  value={draftSortBy}
                  onChange={(e) => setDraftSortBy(e.target.value as SortBy)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  className={`py-3 text-xs tracking-[0.2em] uppercase border ${draftSortOrder === 'desc' ? 'bg-white text-black border-white' : 'border-white/20 text-zinc-200 hover:border-white/40'}`}
                  onClick={() => setDraftSortOrder('desc')}
                >
                  Descending
                </button>
                <button
                  className={`py-3 text-xs tracking-[0.2em] uppercase border ${draftSortOrder === 'asc' ? 'bg-white text-black border-white' : 'border-white/20 text-zinc-200 hover:border-white/40'}`}
                  onClick={() => setDraftSortOrder('asc')}
                >
                  Ascending
                </button>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/10 flex justify-end">
              <button
                className="bg-white text-black text-xs px-6 py-3 tracking-[0.2em] uppercase font-semibold hover:bg-zinc-200"
                onClick={handleApplySort}
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Listings Grid */}
      <div className="max-w-425 mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 min-h-75">
          {loading && Array.from({ length: 8 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="bg-[#1a1a1a] animate-pulse">
              <div className="aspect-4/3 bg-zinc-800" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-zinc-700" />
                <div className="h-3 bg-zinc-800" />
                <div className="h-3 bg-zinc-800" />
              </div>
            </div>
          ))}

          {!loading && listings.map((vehicle) => {
            const make = vehicle.vehicle.make || vehicle.vehicle.standard?.make || 'Unknown Make'
            const model = vehicle.vehicle.model || vehicle.vehicle.standard?.model || 'Unknown Model'
            const derivative = vehicle.vehicle.derivative || vehicle.vehicle.standard?.derivative || ''
            const mileage = vehicle.vehicle.odometerReadingMiles
            const fuelType = vehicle.vehicle.fuelType || vehicle.vehicle.standard?.fuelType || 'N/A'
            const transmission = vehicle.vehicle.transmissionType || vehicle.vehicle.standard?.transmissionType || 'N/A'
            const colour = vehicle.vehicle.colour || vehicle.vehicle.standard?.colour || 'N/A'
            const price = vehicle.adverts?.forecourtPrice?.amountGBP || vehicle.adverts?.retailAdverts?.totalPrice?.amountGBP || null
            const wasPrice = vehicle.adverts?.soldPrice?.amountGBP || null
            const image = vehicle.media?.images?.[0]?.href || '/placeholder.svg'
            const href = `/used-cars/${generateVehicleSlug(vehicle)}`

            return (
              <Link href={href} key={vehicle.metadata.stockId} className="group bg-[#1a1a1a] flex flex-col hover:bg-[#222] transition-colors! duration-300!">
                {/* Image Container */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={`${make} ${model}`} className="w-full h-full object-cover transition-transform! duration-700! group-hover:scale-105" />
                  {/* Logo Overlay */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-70 pointer-events-none">
                    <h2 className="text-2xl tracking-[0.3em] font-light text-white uppercase">MYDV autos</h2>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 flex flex-col grow text-center">
                  {/* Title */}
                  <div className="mb-4">
                    <h3 className="text-sm font-light tracking-widest uppercase mb-1">
                      {make} {model}
                    </h3>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider h-6 overflow-hidden text-ellipsis px-4">
                      {derivative}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="text-[9px] text-zinc-400 tracking-[0.15em] uppercase mb-8 flex justify-center items-center gap-2">
                    <span>{formatMileage(mileage)}</span>
                    <span>/</span>
                    <span>{fuelType}</span>
                    <span>/</span>
                    <span>{transmission}</span>
                    <span>/</span>
                    <span>{colour}</span>
                  </div>

                  {/* Pricing */}
                  <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/10">
                    <div className="text-sm font-semibold text-zinc-300">
                      {price ? `£${new Intl.NumberFormat('en-GB').format(price)}` : 'POA'}
                      {wasPrice && (
                        <span className="text-[8px] text-zinc-500 ml-2 line-through font-normal">Was £{new Intl.NumberFormat('en-GB').format(wasPrice)}</span>
                      )}
                    </div>
                    <div className="text-right flex items-baseline gap-1">
                      <span className="text-sm font-bold text-white">{calculateMonthlyPayment(price)}</span>
                      <span className="text-[8px] text-zinc-400 uppercase tracking-widest">per month</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}

          {!loading && !listings.length && (
            <div className="col-span-full border border-white/10 bg-[#171717] p-10 text-center">
              <h3 className="text-sm tracking-[0.2em] uppercase mb-3">No Vehicles Found</h3>
              <p className="text-xs text-zinc-400 tracking-wide uppercase">Try widening your filters or changing the sort order.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-20 text-[10px] tracking-widest uppercase pb-10 font-bold flex-wrap">
            <button
              className="px-3 py-1 text-zinc-400 hover:text-white disabled:opacity-40"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Prev
            </button>

            {visiblePagination.map((_, index) => {
              const page = Math.max(1, currentPage - 2) + index
              if (page > totalPages) {
                return null
              }

              return (
                <button
                  key={`page-${page}`}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 border border-zinc-700 py-1 ${page === currentPage ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                  {page}
                </button>
              )
            })}

            <button
              className="px-3 py-1 text-zinc-400 hover:text-white disabled:opacity-40"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next &rsaquo;
            </button>

            <button
              className="px-3 py-1 text-zinc-400 hover:text-white disabled:opacity-40"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage >= totalPages}
            >
              Last &raquo;
            </button>
          </div>
        )}

        {/* Finance Disclosure */}
        <div className="text-center max-w-5xl mx-auto border-t border-white/10 pt-10 mt-10 space-y-4">
            <h4 className="text-[10px] tracking-[0.2em] font-bold text-white uppercase">FINANCE REPRESENTATIVE EXAMPLE (HP)</h4>
            <p className="text-[9px] text-zinc-400 leading-relaxed">
              Total cash price <span className="text-white">£232,995.00</span>. Borrowing <span className="text-white">£209,695.50</span> with a <span className="text-white">£23,299.50</span> deposit at a representative APR of <span className="text-white">11.4%</span>. Total amount payable <span className="text-white">£295,881.90</span>. We are a credit broker not a lender.
            </p>
            
            <div className="grid grid-cols-6 border border-white/10 text-center mt-6 uppercase text-[9px] tracking-wider text-zinc-400 divide-x divide-white/10">
              <div className="py-4 px-2">
                <div className="mb-1">60 monthly payments of</div>
                <div className="text-white font-bold">£4,543.04</div>
              </div>
              <div className="py-4 px-2">
                <div className="mb-1">Representative APR</div>
                <div className="text-white font-bold">11.4%</div>
              </div>
              <div className="py-4 px-2">
                <div className="mb-1">Fixed interest rate</div>
                <div className="text-white font-bold">11.40%</div>
              </div>
              <div className="py-4 px-2">
                <div className="mb-1">Final payment</div>
                <div className="text-white font-bold">£4,543.04</div>
              </div>
              <div className="py-4 px-2">
                <div className="mb-1">Option to purchase fee</div>
                <div className="text-white font-bold">£0.00</div>
              </div>
              <div className="py-4 px-2 col-span-1">
                <div className="mb-1">Total amount of credit</div>
                <div className="text-white font-bold">209,695.50</div>
              </div>
            </div>
            
        </div>
      </div>
    </main>
  )
}