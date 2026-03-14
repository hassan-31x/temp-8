import { NextRequest, NextResponse } from 'next/server'
import { VehicleReservationData } from '@/types/webhook'
import { sendVehicleReservationEmail } from '@/utilities/sendEmail'

export async function POST(request: NextRequest) {
  try {
    const data: VehicleReservationData = await request.json()

    // Validate required fields
    if (!data.customerDetails || !data.vehicleDetails) {
      return NextResponse.json(
        { error: 'Missing required customer or vehicle details' },
        { status: 400 }
      )
    }

    // Validate customer details
    const { firstName, lastName, email, phone, address, title } = data.customerDetails
    if (!firstName || !lastName || !email || !phone || !address || !title) {
      return NextResponse.json(
        { error: 'Missing required customer information' },
        { status: 400 }
      )
    }

    // Validate vehicle details
    const { make, model, registration } = data.vehicleDetails
    if (!make || !model || !registration) {
      return NextResponse.json(
        { error: 'Missing required vehicle information' },
        { status: 400 }
      )
    }

    // Validate amount
    if (!data.amount || data.amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid reservation amount' },
        { status: 400 }
      )
    }

    // Send email notification
    const emailResult = await sendVehicleReservationEmail(data)
    
    if (!emailResult.success) {
      console.error('Failed to send vehicle reservation email:', emailResult.error)
      // Don't fail the entire request if email fails
    }

    // Submit to webhook if URL is configured
    const webhookUrl = process.env.VEHICLE_RESERVATION_WEBHOOK_URL || process.env.FORM_SUBMIT_WEBHOOK_URL
    
    let webhookSuccess = false
    let webhookError = null

    if (webhookUrl) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'vehicle-reservation',
            timestamp: new Date().toISOString(),
            data: {
              ...data,
              affiliateId: process.env.DEALER_ID || "b1cc0a28-8ea3-4964-a6bf-07e2a2677a70",
            },
          }),
        })

        if (webhookResponse.ok) {
          webhookSuccess = true
        } else {
          throw new Error(`Webhook failed with status: ${webhookResponse.status}`)
        }
      } catch (error) {
        console.error('Error submitting to webhook:', error)
        webhookError = error instanceof Error ? error.message : 'Unknown webhook error'
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Vehicle reservation request submitted successfully',
      email: {
        sent: emailResult.success,
        emailId: emailResult.emailId,
        error: emailResult.error,
      },
      webhook: {
        sent: webhookSuccess,
        error: webhookError,
      },
    })

  } catch (error) {
    console.error('Error processing vehicle reservation request:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
