import { AutoTraderVehicle } from "./autotrader"

// Function to extract unique makes and models from vehicles
export function extractMakesAndModelsFromVehicles(vehicles: AutoTraderVehicle[]): {
  makes: Array<{makeId: string, name: string}>
  models: Array<{makeId: string, makeName: string, modelId: string, name: string}>
} {
  const makeMap = new Map<string, string>()
  const modelMap = new Map<string, {makeId: string, makeName: string, modelId: string, name: string}>()

  vehicles.forEach(vehicle => {
    const make = vehicle.vehicle.make || vehicle.vehicle.standard?.make
    const model = vehicle.vehicle.model || vehicle.vehicle.standard?.model

    if (make) {
      // Create a simple ID from the make name (you might want to use actual IDs if available)
      const makeId = make.toLowerCase().replace(/[^a-z0-9]/g, '')
      makeMap.set(makeId, make)

      if (model) {
        // Create a simple model ID from make and model names
        const modelId = `${makeId}-${model.toLowerCase().replace(/[^a-z0-9]/g, '')}`
        modelMap.set(modelId, {
          makeId,
          makeName: make,
          modelId,
          name: model
        })
      }
    }
  })

  const makes = Array.from(makeMap.entries()).map(([makeId, name]) => ({
    makeId,
    name
  })).sort((a, b) => a.name.localeCompare(b.name))

  const models = Array.from(modelMap.values()).sort((a, b) => a.name.localeCompare(b.name))

  return { makes, models }
}