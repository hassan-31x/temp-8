import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import type { Payment } from '@/payload-types'

// Get the redirect URL based on environment
const getRedirectUrl = (req: NextRequest) => {
  const baseUrl = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SERVER_URL : `https://0gcwk9v5-3001.euw.devtunnels.ms`
  return `${baseUrl}/reservation/success`
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config })
    const body = await req.json()
    const { customerDetails, vehicleDetails, amount } = body

    // Validate required fields
    if (!customerDetails?.firstName || !customerDetails?.lastName || !customerDetails?.email || !customerDetails?.phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required customer details' },
        { status: 400 }
      )
    }

    if (!vehicleDetails?.make || !vehicleDetails?.model || !vehicleDetails?.registration) {
      return NextResponse.json(
        { success: false, error: 'Missing required vehicle details' },
        { status: 400 }
      )
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Generate unique IDs
    const orderId = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const customerId = `CUST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Prepare Atoa payment request
    const atoaPayload = {
      customerId,
      orderId,
      amount: Number((Number(amount) / 100).toFixed(2)), // Amount already in pence
      currency: 'GBP',
      paymentType: process.env.NODE_ENV === 'production' ? 'DOMESTIC' : 'DOMESTIC',
      // TODO: find real institution id
      institutionId: 'modelo-sandbox',
      // TODO: find real store id
      storeId: '43c7b991-0803-4177-9589-d165d9a779f6',
      consumerDetails: {
        phoneCountryCode: '44',
        phoneNumber: customerDetails.phone.replace(/[^\d]/g, ''), // Remove non-digits
        email: customerDetails.email,
        firstName: customerDetails.firstName,
        lastName: customerDetails.lastName,
      },
      redirectUrl: getRedirectUrl(req),
      expiresIn: 1800000, // 30 minutes in milliseconds
      enableTips: false,
      allowRetry: true,
    }

    // Make request to Atoa API
    const atoaResponse = await fetch('https://api.atoa.me/api/payments/process-payment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ATOA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(atoaPayload),
    })

    const atoaData = await atoaResponse.json()

    if (!atoaResponse.ok) {
      const errorData = await atoaResponse.text()
      console.error('Atoa API Error:', errorData)
      return NextResponse.json(
        { success: false, error: 'Failed to create payment request with Atoa' },
        { status: 500 }
      )
    }

    const payloadData = {
        customerDetails: {
          title: customerDetails.title || '',
          firstName: customerDetails.firstName,
          lastName: customerDetails.lastName,
          email: customerDetails.email,
          phone: customerDetails.phone,
          address: customerDetails.address || '',
        },
        vehicleDetails: {
          make: vehicleDetails.make,
          model: vehicleDetails.model,
          registration: vehicleDetails.registration,
          stockId: vehicleDetails.stockId || '',
        },
        amount: Number((Number(amount) / 100).toFixed(2)),
        currency: 'GBP',
        atoaPaymentDetails: {
          paymentRequestId: atoaData.paymentRequestId || '',
          orderId: orderId || '',
          customerId: customerId || '',
          paymentUrl: atoaData.paymentUrl || '',
          qrCodeUrl: atoaData.qrCodeUrl || '',
          paymentIdempotencyId: atoaData.paymentIdempotencyId || '',
        },
        paymentStatus: 'PENDING' as const,
        customerName: `${customerDetails.firstName} ${customerDetails.lastName}`,
        paidAmount: 0,
        tipAmount: 0,
      }

    // Store payment record in Payload
    const paymentRecord = await payload.create({
      collection: 'payments',
      data: payloadData as Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>,
    })

    return NextResponse.json({
      success: true,
      paymentId: paymentRecord.id,
      paymentUrl: atoaData.paymentUrl,
      paymentRequestId: atoaData.paymentRequestId,
    })

  } catch (error) {
    console.error('Error creating reservation:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
