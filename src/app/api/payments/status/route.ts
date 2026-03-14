import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config })
    const searchParams = req.nextUrl.searchParams
    const paymentRequestId = searchParams.get('paymentRequestId')

    if (!paymentRequestId) {
      return NextResponse.json(
        { success: false, error: 'Payment request ID is required' },
        { status: 400 }
      )
    }

    // Get payment status from Atoa
    const env = process.env.NODE_ENV === 'production' ? '' : '&env=sandbox'
    const atoaResponse = await fetch(
      `https://api.atoa.me/api/payments/payment-status/${paymentRequestId}?type=request${env}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.ATOA_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!atoaResponse.ok) {
      console.error('Atoa API Error:', await atoaResponse.text())
      return NextResponse.json(
        { success: false, error: 'Failed to get payment status from Atoa' },
        { status: 500 }
      )
    }

    const atoaData = await atoaResponse.json()

    // Update payment record in Payload
    const existingPayment = await payload.find({
      collection: 'payments',
      where: {
        'atoaPaymentDetails.paymentRequestId': {
          equals: paymentRequestId,
        },
      },
      limit: 1,
    })

    if (existingPayment.docs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Payment record not found' },
        { status: 404 }
      )
    }

    const paymentRecord = existingPayment.docs[0]

    // Update the payment record with the latest status
    await payload.update({
      collection: 'payments',
      id: paymentRecord.id,
      data: {
        paymentStatus: atoaData.status,
        statusDetails: {
          statusUpdateDate: atoaData.statusDetails?.statusUpdateDate || new Date().toISOString(),
          isoStatus: atoaData.statusDetails?.isoStatus || null,
          errorDescription: atoaData.errorDescription || null,
        },
        paidAmount: atoaData.paidAmount ? parseInt(atoaData.paidAmount) : null,
        tipAmount: atoaData.tipAmount ? Math.round(parseFloat(atoaData.tipAmount) * 100) : null,
        signatureHash: atoaData.signatureHash || null,
        atoaPaymentDetails: {
          ...paymentRecord.atoaPaymentDetails,
          paymentIdempotencyId: atoaData.paymentIdempotencyId || paymentRecord.atoaPaymentDetails?.paymentIdempotencyId,
        },
      },
    })

    return NextResponse.json({
      success: true,
      paymentStatus: atoaData.status,
      paymentData: atoaData,
      paymentRecord: paymentRecord,
    })

  } catch (error) {
    console.error('Error checking payment status:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
