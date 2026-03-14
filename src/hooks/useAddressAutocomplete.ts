'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface AddressComponent {
  long_name: string
  short_name: string
  types: string[]
}

interface PlaceResult {
  address_components: AddressComponent[]
  formatted_address: string
  place_id: string
}

interface AddressData {
  streetNumber: string
  route: string
  locality: string
  administrativeAreaLevel1: string
  administrativeAreaLevel2: string
  postalCode: string
  country: string
  formattedAddress: string
}

interface UseAddressAutocompleteOptions {
  onAddressSelect?: (address: AddressData) => void
  countries?: string[]
  types?: string[]
}

export function useAddressAutocomplete(options: UseAddressAutocompleteOptions = {}) {
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesService = useRef<google.maps.places.PlacesService | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  const { onAddressSelect, countries = ['GB'], types = ['address'] } = options

  // Initialize Google Maps services
  useEffect(() => {
    const initializeServices = async () => {
      if (typeof window !== 'undefined' && window.google) {
        autocompleteService.current = new google.maps.places.AutocompleteService()
        
        // Create a dummy map for PlacesService (required by Google Maps API)
        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: 51.5074, lng: -0.1278 }, // London
            zoom: 10,
          })
          placesService.current = new google.maps.places.PlacesService(map)
        }
      }
    }

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initializeServices
      document.head.appendChild(script)
    } else {
      initializeServices()
    }
  }, [])

  const getSuggestions = useCallback(
    async (input: string) => {
      if (!autocompleteService.current || input.length < 3) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      
      try {
        const request: google.maps.places.AutocompletionRequest = {
          input,
          componentRestrictions: { country: countries },
          types,
        }

        autocompleteService.current.getPlacePredictions(
          request,
          (predictions, status) => {
            setIsLoading(false)
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
              setSuggestions(predictions)
              setShowSuggestions(true)
            } else {
              setSuggestions([])
              setShowSuggestions(false)
            }
          }
        )
      } catch (error) {
        setIsLoading(false)
        console.error('Error getting address suggestions:', error)
        setSuggestions([])
      }
    },
    [countries, types]
  )

  const getPlaceDetails = useCallback(
    async (placeId: string): Promise<AddressData | null> => {
      if (!placesService.current) return null

      return new Promise((resolve) => {
        const request = {
          placeId,
          fields: ['address_components', 'formatted_address'],
        }

        placesService.current!.getDetails(request, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            const addressData = parseAddressComponents(place as PlaceResult)
            resolve(addressData)
          } else {
            resolve(null)
          }
        })
      })
    },
    []
  )

  const parseAddressComponents = (place: PlaceResult): AddressData => {
    const components = place.address_components
    const addressData: AddressData = {
      streetNumber: '',
      route: '',
      locality: '',
      administrativeAreaLevel1: '',
      administrativeAreaLevel2: '',
      postalCode: '',
      country: '',
      formattedAddress: place.formatted_address,
    }

    components.forEach((component) => {
      const types = component.types
      
      if (types.includes('street_number')) {
        addressData.streetNumber = component.long_name
      } else if (types.includes('route')) {
        addressData.route = component.long_name
      } else if (types.includes('locality')) {
        addressData.locality = component.long_name
      } else if (types.includes('administrative_area_level_1')) {
        addressData.administrativeAreaLevel1 = component.long_name
      } else if (types.includes('administrative_area_level_2')) {
        addressData.administrativeAreaLevel2 = component.long_name
      } else if (types.includes('postal_code')) {
        addressData.postalCode = component.long_name
      } else if (types.includes('country')) {
        addressData.country = component.long_name
      }
    })

    return addressData
  }

  const selectAddress = useCallback(
    async (prediction: google.maps.places.AutocompletePrediction) => {
      setInputValue(prediction.description)
      setSuggestions([])
      setShowSuggestions(false)

      const addressData = await getPlaceDetails(prediction.place_id)
      if (addressData && onAddressSelect) {
        onAddressSelect(addressData)
      }
    },
    [getPlaceDetails, onAddressSelect]
  )

  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value)
      getSuggestions(value)
    },
    [getSuggestions]
  )

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setShowSuggestions(false)
  }, [])

  return {
    inputValue,
    suggestions,
    isLoading,
    showSuggestions,
    mapRef,
    handleInputChange,
    selectAddress,
    clearSuggestions,
    setInputValue,
  }
}
