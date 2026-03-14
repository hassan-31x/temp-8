import { AutoTraderVehicle } from "./autotrader"
import { FeaturedVehicle } from "@/components/home/featured-vehicles"

export const generateVehicleSlug = (vehicle: AutoTraderVehicle | FeaturedVehicle) => {
  const make = (vehicle.vehicle.make || vehicle.vehicle.standard?.make || '').toLowerCase().replace(/\s+/g, '-')
  const model = (vehicle.vehicle.model || vehicle.vehicle.standard?.model || '').toLowerCase().replace(/\s+/g, '-')
  const year = vehicle.vehicle.yearOfManufacture || 'unknown'
  // const vehicleRegistration = vehicle.vehicle.registration || vehicle.metadata.stockId
  const vehicleRegistration = vehicle.metadata.stockId

  return `${make}-${model}-${year}-${vehicleRegistration}`
}

export const formatPrice = (price: number | null) => {
  if (!price) return 'N/A'
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
