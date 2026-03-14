# Email Setup Guide

This guide explains how to set up email notifications for form submissions using Resend.

## Prerequisites

1. **Resend Account**: Sign up at [resend.com](https://resend.com)
2. **Domain Verification**: Verify your sending domain in Resend
3. **API Key**: Generate an API key from your Resend dashboard

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Resend API key for sending emails
RESEND_API_KEY=re_your_resend_api_key_here

# Email configuration
EMAIL_FROM=noreply@yourdealership.com
EMAIL_TO=enquiries@yourdealership.com

# Form submission webhook URL (optional)
FORM_SUBMIT_WEBHOOK_URL=https://your-webhook-endpoint.com/api/webhooks/dealer

# Vehicle reservation webhook URL (optional - falls back to FORM_SUBMIT_WEBHOOK_URL)
VEHICLE_RESERVATION_WEBHOOK_URL=https://your-webhook-endpoint.com/api/webhooks/reservations
```

## How It Works

### 1. Form Submission Flow

When a customer submits any form on the website:

1. **Standard Forms**: Form data is sent to `/api/submit-form`
2. **Vehicle Reservations**: Reservation data is sent to `/api/submit-reservation`
3. The API endpoint processes the data and:
   - Sends the data to your external webhook (if configured)
   - Sends an email notification using Resend
4. Returns success/error status for both operations

### 2. Supported Form Types

The system automatically detects form types and sends appropriate emails:

- **Part Exchange**: Customer wants to trade in their vehicle
- **Find Your Next Car**: General vehicle enquiry
- **Book Appointment**: Test drive or appointment booking
- **Request Finance**: Finance application
- **Vehicle Reservation**: Customer wants to reserve a specific vehicle (priority)

### 3. Email Templates

Each form type gets a customized email template with:

- **Professional formatting** with your brand colors
- **Structured data sections** for easy reading
- **Priority indicators** for urgent requests (e.g., test drives)
- **Responsive design** that works on all devices

## Email Content Structure

### Personal Information
- Customer name, email, phone
- Address and personal details
- Date of birth, marital status (for finance applications)

### Vehicle Information
- Vehicle of interest (make, model, registration)
- Customer's current vehicle (for part exchange)
- Pricing and finance details

### Specific Sections (when applicable)
- **Test Drive**: Date, time, and requirements
- **Employment**: Status, income, employer details
- **Finance**: Monthly expenses, existing commitments
- **Banking**: Account details (partially masked for security)

## Customization

### Email Styling
Edit `/src/utilities/sendEmail.ts` to customize:
- Colors and branding
- Email structure
- Content sections

### Subject Lines
The system automatically generates subject lines based on enquiry type:
- "New Part Exchange Enquiry"
- "New Vehicle Enquiry"
- "New Appointment Request"
- "New Finance Application"
- "New Vehicle Reservation Request" (priority)

### Recipients
Set multiple recipients by using comma-separated emails:
```bash
EMAIL_TO=sales@dealership.com,manager@dealership.com
```

## Security Considerations

1. **API Key Security**: Never expose your Resend API key in client-side code
2. **Data Masking**: Sensitive data like account numbers are partially masked in emails
3. **Validation**: All form data is validated before processing

## Troubleshooting

### Common Issues

1. **Emails not sending**: Check your Resend API key and domain verification
2. **Wrong sender email**: Ensure `EMAIL_FROM` uses a verified domain
3. **Missing form data**: Check that WebhookData structure matches in all forms

### Testing

Test the email system by:
1. Submitting a form on your website
2. Checking the API response in browser dev tools
3. Verifying email delivery in your inbox
4. Checking Resend dashboard for delivery status

### Error Handling

The system gracefully handles failures:
- If webhook fails, email still attempts to send
- If email fails, webhook still attempts to send
- Detailed error messages in API response
- Console logging for debugging

## Support

For issues with:
- **Resend integration**: Check [Resend documentation](https://resend.com/docs)
- **Email templates**: Review `/src/utilities/sendEmail.ts`
- **Form integration**: Check individual form components

## Best Practices

1. **Response Time**: Set up email forwarding to ensure quick response
2. **Auto-Reply**: Consider setting up auto-reply emails for customers
3. **Monitoring**: Monitor email delivery rates in Resend dashboard
4. **Testing**: Test all form types after deployment