import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'
import { fetchAutoTraderListings, AutoTraderVehicle, fetchAllAutoTraderListings } from '../../utilities/autotrader'

// Fetch all listings from AutoTrader


// Convert AutoTrader vehicle data to Payload format (exact match)
function convertAutoTraderToPayload(vehicle: AutoTraderVehicle, preserveCustomFields: boolean = false, existingData?: any) {
  const baseData = {
    title: `${vehicle.vehicle.make} - ${vehicle.vehicle.model} - ${vehicle.vehicle.yearOfManufacture}`,
    vehicle: {
      ownershipCondition: vehicle.vehicle.ownershipCondition,
      registration: vehicle.vehicle.registration,
      vin: vehicle.vehicle.vin,
      make: vehicle.vehicle.make,
      model: vehicle.vehicle.model,
      generation: vehicle.vehicle.generation,
      derivative: vehicle.vehicle.derivative,
      derivativeId: vehicle.vehicle.derivativeId,
      vehicleType: vehicle.vehicle.vehicleType,
      trim: vehicle.vehicle.trim,
      bodyType: vehicle.vehicle.bodyType,
      fuelType: vehicle.vehicle.fuelType,
      transmissionType: vehicle.vehicle.transmissionType,
      drivetrain: vehicle.vehicle.drivetrain,
      seats: vehicle.vehicle.seats,
      doors: vehicle.vehicle.doors,
      cylinders: vehicle.vehicle.cylinders,
      co2EmissionGPKM: vehicle.vehicle.co2EmissionGPKM,
      topSpeedMPH: vehicle.vehicle.topSpeedMPH,
      zeroToSixtyMPHSeconds: vehicle.vehicle.zeroToSixtyMPHSeconds,
      badgeEngineSizeLitres: vehicle.vehicle.badgeEngineSizeLitres,
      engineCapacityCC: vehicle.vehicle.engineCapacityCC,
      enginePowerBHP: vehicle.vehicle.enginePowerBHP,
      fuelCapacityLitres: vehicle.vehicle.fuelCapacityLitres,
      emissionClass: vehicle.vehicle.emissionClass,
      owners: vehicle.vehicle.owners,
      fuelEconomyNEDCCombinedMPG: vehicle.vehicle.fuelEconomyNEDCCombinedMPG,
      fuelEconomyWLTPCombinedMPG: vehicle.vehicle.fuelEconomyWLTPCombinedMPG,
      bootSpaceSeatsUpLitres: vehicle.vehicle.bootSpaceSeatsUpLitres,
      insuranceGroup: vehicle.vehicle.insuranceGroup,
      firstRegistrationDate: vehicle.vehicle.firstRegistrationDate,
      colour: vehicle.vehicle.colour,
      style: vehicle.vehicle.style,
      odometerReadingMiles: vehicle.vehicle.odometerReadingMiles,
      motExpiryDate: vehicle.vehicle.motExpiryDate,
      warrantyMonthsOnPurchase: vehicle.vehicle.warrantyMonthsOnPurchase,
      serviceHistory: vehicle.vehicle.serviceHistory,
      plate: vehicle.vehicle.plate,
      yearOfManufacture: vehicle.vehicle.yearOfManufacture,
      standard: {
        make: vehicle.vehicle.standard?.make,
        model: vehicle.vehicle.standard?.model,
        generation: vehicle.vehicle.standard?.generation,
        derivative: vehicle.vehicle.standard?.derivative,
        trim: vehicle.vehicle.standard?.trim,
        bodyType: vehicle.vehicle.standard?.bodyType,
        fuelType: vehicle.vehicle.standard?.fuelType,
        transmissionType: vehicle.vehicle.standard?.transmissionType,
        colour: vehicle.vehicle.standard?.colour,
        style: vehicle.vehicle.standard?.style,
      },
    },

    advertiser: {
      advertiserId: vehicle.advertiser.advertiserId,
      name: vehicle.advertiser.name,
      segment: vehicle.advertiser.segment,
      website: vehicle.advertiser.website,
      phone: vehicle.advertiser.phone,
      location: {
        addressLineOne: vehicle.advertiser.location.addressLineOne,
        town: vehicle.advertiser.location.town,
        county: vehicle.advertiser.location.county,
        region: vehicle.advertiser.location.region,
        postCode: vehicle.advertiser.location.postCode,
        latitude: vehicle.advertiser.location.latitude,
        longitude: vehicle.advertiser.location.longitude,
      },
    },

    adverts: {
      forecourtPrice: {
        amountGBP: vehicle.adverts?.forecourtPrice?.amountGBP,
      },
      soldPrice: vehicle.adverts?.soldPrice ? {
        amountGBP: vehicle.adverts.soldPrice.amountGBP,
      } : undefined,
      forecourtPriceVatStatus: vehicle.adverts?.forecourtPriceVatStatus,
      vatScheme: vehicle.adverts?.vatScheme,
      dueDate: vehicle.adverts?.dueDate,
      manufacturerApproved: vehicle.adverts?.manufacturerApproved,
      twelveMonthsMot: vehicle.adverts?.twelveMonthsMot,
      motInsurance: vehicle.adverts?.motInsurance,
      reservationStatus: vehicle.adverts?.reservationStatus,
      retailAdverts: {
        priceOnApplication: vehicle.adverts?.retailAdverts?.priceOnApplication,
        suppliedPrice: {
          amountGBP: vehicle.adverts?.retailAdverts?.suppliedPrice?.amountGBP,
          amountGBX: vehicle.adverts?.retailAdverts?.suppliedPrice?.amountGBX,
        },
        totalPrice: {
          amountGBP: vehicle.adverts?.retailAdverts?.totalPrice?.amountGBP,
        },
        adminFee: vehicle.adverts?.retailAdverts?.adminFee ? {
          amountGBP: vehicle.adverts.retailAdverts.adminFee.amountGBP,
        } : undefined,
        adminFeeOverride: vehicle.adverts?.retailAdverts?.adminFeeOverride ? {
          amountGBP: vehicle.adverts.retailAdverts.adminFeeOverride.amountGBP,
        } : undefined,
        manufacturerRRP: vehicle.adverts?.retailAdverts?.manufacturerRRP ? {
          amountGBP: vehicle.adverts.retailAdverts.manufacturerRRP.amountGBP,
        } : undefined,
        vatStatus: vehicle.adverts?.retailAdverts?.vatStatus,
        attentionGrabber: vehicle.adverts?.retailAdverts?.attentionGrabber,
        description: vehicle.adverts?.retailAdverts?.description,
        description2: vehicle.adverts?.retailAdverts?.description2,
        priceIndicatorRating: vehicle.adverts?.retailAdverts?.priceIndicatorRating,
        priceIndicatorRatingBands: vehicle.adverts?.retailAdverts?.priceIndicatorRatingBands,
        autotraderAdvert: {
          status: vehicle.adverts?.retailAdverts?.autotraderAdvert?.status,
          eligibleContractAllowances: vehicle.adverts?.retailAdverts?.autotraderAdvert?.eligibleContractAllowances?.map(allowance => ({
            type: allowance.type,
          })),
          allocatedContractAllowance: vehicle.adverts?.retailAdverts?.autotraderAdvert?.allocatedContractAllowance ? {
            type: vehicle.adverts.retailAdverts.autotraderAdvert.allocatedContractAllowance.type,
          } : undefined,
        },
        advertiserAdvert: vehicle.adverts?.retailAdverts?.advertiserAdvert ? {
          status: vehicle.adverts.retailAdverts.advertiserAdvert.status,
        } : undefined,
        locatorAdvert: vehicle.adverts?.retailAdverts?.locatorAdvert ? {
          status: vehicle.adverts.retailAdverts.locatorAdvert.status,
        } : undefined,
        exportAdvert: vehicle.adverts?.retailAdverts?.exportAdvert ? {
          status: vehicle.adverts.retailAdverts.exportAdvert.status,
        } : undefined,
        profileAdvert: vehicle.adverts?.retailAdverts?.profileAdvert ? {
          status: vehicle.adverts.retailAdverts.profileAdvert.status,
        } : undefined,
        displayOptions: vehicle.adverts?.retailAdverts?.displayOptions ? {
          excludePreviousOwners: vehicle.adverts.retailAdverts.displayOptions.excludePreviousOwners,
          excludeStrapline: vehicle.adverts.retailAdverts.displayOptions.excludeStrapline,
          excludeMot: vehicle.adverts.retailAdverts.displayOptions.excludeMot,
          excludeWarranty: vehicle.adverts.retailAdverts.displayOptions.excludeWarranty,
          excludeInteriorDetails: vehicle.adverts.retailAdverts.displayOptions.excludeInteriorDetails,
          excludeTyreCondition: vehicle.adverts.retailAdverts.displayOptions.excludeTyreCondition,
          excludeBodyCondition: vehicle.adverts.retailAdverts.displayOptions.excludeBodyCondition,
        } : undefined,
        financeOffers: vehicle.adverts?.retailAdverts?.financeOffers,
        reservePrice: 99, // Default reserve price for new listings
      },
      tradeAdverts: vehicle.adverts?.tradeAdverts ? {
        dealerAuctionAdvert: {
          status: vehicle.adverts.tradeAdverts.dealerAuctionAdvert.status,
        },
      } : undefined,
    },

    metadata: {
      stockId: vehicle.metadata.stockId,
      searchId: vehicle.metadata.searchId,
      externalStockId: vehicle.metadata.externalStockId,
      lastUpdated: vehicle.metadata.lastUpdated,
      versionNumber: vehicle.metadata.versionNumber,
      lifecycleState: vehicle.metadata.lifecycleState,
      dateOnForecourt: vehicle.metadata.dateOnForecourt,
    },

    features: vehicle.features?.map(feature => ({
      name: feature.name,
      type: feature.type,
      standardName: feature.standardName,
      category: feature.category,
      rarityRating: feature.rarityRating,
      valueRating: feature.valueRating,
    })) || [],

    highlights: vehicle.highlights?.map(highlight => ({
      highlight: typeof highlight === 'string' ? highlight : (highlight as any)?.name || String(highlight),
    })) || [],

    media: {
      images: vehicle.media?.images?.map(image => ({
        href: image.href,
        templated: image.templated,
      })) || [],
      video: {
        href: vehicle.media?.video?.href || null,
      },
      spin: {
        href: vehicle.media?.spin?.href || null,
      },
    },
  }

  // If preserving custom fields and we have existing data, merge the custom fields
  if (preserveCustomFields && existingData) {
    // Preserve custom description and price fields
    if (existingData.adverts?.retailAdverts?.description) {
      baseData.adverts.retailAdverts.description = existingData.adverts.retailAdverts.description
    }
    if (existingData.adverts?.retailAdverts?.totalPrice?.amountGBP) {
      baseData.adverts.retailAdverts.totalPrice.amountGBP = existingData.adverts.retailAdverts.totalPrice.amountGBP
      baseData.adverts.forecourtPrice.amountGBP = existingData.adverts.retailAdverts.totalPrice.amountGBP
    }
    // Always preserve reserve price as it's a custom field
    if (existingData.adverts?.retailAdverts?.reservePrice !== undefined) {
      baseData.adverts.retailAdverts.reservePrice = existingData.adverts.retailAdverts.reservePrice
    }
  }

  return baseData
}

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`

/**
 * AutoTrader Sync Function
 * 
 * This function fetches all vehicle listings from AutoTrader API and syncs them with Payload CMS:
 * 
 * 1. Fetches all listings from AutoTrader using pagination (same approach as listings API)
 * 2. For each vehicle, checks if it already exists in Payload by stockId (metadata.stockId)
 * 3. If exists: Updates all fields with latest AutoTrader data (complete overwrite)
 * 4. If new: Creates new listing with exact AutoTrader data structure
 * 
 * The Payload schema now matches AutoTrader structure exactly for backup purposes.
 * Only admin users can create/update listings, so this uses admin credentials regardless of logged-in user.
 * 
 * Environment variables required:
 * - AUTOTRADER_API_URL
 * - AUTOTRADER_API_KEY  
 * - AUTOTRADER_API_SECRET
 * - AUTOTRADER_ADVERTISER_ID
 */
export const seed = async ({
  payload,
  req,
  overrideDescriptionAndPrice = false,
}: {
  payload: Payload
  req: PayloadRequest
  overrideDescriptionAndPrice?: boolean
}) => {
  
}
