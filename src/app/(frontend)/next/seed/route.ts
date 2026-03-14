import { createLocalReq, getPayload } from 'payload'
import { seed } from '@/endpoints/seed'
import config from '@payload-config'
import { headers } from 'next/headers'
import { User } from '@/payload-types'

export const maxDuration = 60 // This function can run for a maximum of 60 seconds

export async function POST(request: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  // Parse request body to get sync options
  let syncOptions = { overrideDescriptionAndPrice: false }
  try {
    const body = await request.json()
    syncOptions = { ...syncOptions, ...body }
  } catch {
    // Use default options if no body or invalid JSON
  }

  // Authenticate by passing request headers
  // const { user } = await payload.auth({ headers: requestHeaders })
  const adminUsers = await payload.find({
    collection: 'users',
    where: {
      roles: {
        equals: 'admin'
      }
    },
    limit: 1
  })
  const adminUser: User & { collection: 'users' } = {
    ...adminUsers.docs[0],
    collection: 'users'
  }

  // if (!user) {
  //   return new Response('Action forbidden.', { status: 403 })
  // }

  try {
    // Create a Payload request object to pass to the Local API for transactions
    // At this point you should pass in a user, locale, and any other context you need for the Local API
    const payloadReq = await createLocalReq({ user: adminUser }, payload)

    // const result = await seed({ payload, req: payloadReq, overrideDescriptionAndPrice: syncOptions.overrideDescriptionAndPrice })

    return Response.json({ 
      success: true, 
      // createdCount: result.createdCount,
      // updatedCount: result.updatedCount, 
      // deletedCount: result.deletedCount,
      // errorCount: result.errorCount
    })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error seeding data' })
    return new Response('Error seeding data.', { status: 500 })
  }
}
