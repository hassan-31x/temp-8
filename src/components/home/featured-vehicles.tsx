import React from 'react'

type Props = {}

export interface FeaturedVehicle {
  id: string
  image: string | null
  tag?: string
  tagColor?: string
  title: string
  subtitle: string
  mileage: string
  fuel: string
  transmission: string
  price: string
  vehicle: {
    make?: string,
    model?: string,
    yearOfManufacture?: string,
    standard?: {
      make?: string,
      model?: string,
    }
    registration?: string,
  }
  metadata: {
    stockId: string,
  }
}

const FeaturedVehicles = (props: Props) => {
  return (
    <div>FeaturedVehicles</div>
  )
}

export default FeaturedVehicles