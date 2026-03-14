'use client'

import React, { useState } from 'react'
import { buildBaseWebhookPayload, submitWebhookForm } from '../used-cars/[slug]/_components/modals/formSubmission'

export default function PartExchangeForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [userRegistration, setUserRegistration] = useState('')
  const [userMileage, setUserMileage] = useState('')
  const [userMake, setUserMake] = useState('')
  const [userModel, setUserModel] = useState('')
  const [recentValuation, setRecentValuation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(false)
    setIsSubmitting(true)

    try {
      const payload = buildBaseWebhookPayload({
        enquiryType: 'part-exchange',
        firstName,
        lastName,
        email,
        phoneNumber: phone,
      })

      // We attach the user vehicle to assess
      payload.userVehicle = {
        make: userMake || null,
        model: userModel || null,
        registration: userRegistration || null,
        mileage: userMileage || null,
        year: null,
        recentValuations: recentValuation || null,
      }

      payload.notes = 'General part exchange enquiry submitted from the Part Exchange page.'

      await submitWebhookForm(payload)
      setSubmitSuccess(true)
      
      // Clear form
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhone('')
      setUserRegistration('')
      setUserMileage('')
      setUserMake('')
      setUserModel('')
      setRecentValuation('')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit part exchange request')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="bg-[#161616] border border-white/10 p-8 md:p-12 text-center">
        <h3 className="text-xl md:text-2xl uppercase tracking-widest font-light mb-4">Request Submitted</h3>
        <p className="text-sm text-zinc-400 font-light">
          Thank you for your part exchange enquiry. We will be in touch shortly with a valuation.
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="mt-8 bg-white text-black px-8 py-4 text-xs font-semibold tracking-widest uppercase hover:bg-zinc-200 transition-colors"
        >
          Submit Another Vehicle
        </button>
      </div>
    )
  }

  return (
    <form className="bg-[#161616] border border-white/10 p-8 md:p-12 space-y-8" onSubmit={handleSubmit}>
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-light tracking-widest uppercase mb-2">Get a Valuation</h2>
        <p className="text-sm text-zinc-400 font-light">Fill in the details below and we&apos;ll get back to you with a competitive part exchange price.</p>
      </div>

      {/* Personal Details */}
      <div className="space-y-4">
        <h3 className="text-sm uppercase tracking-widest text-white border-b border-white/10 pb-2">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">First Name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" required className="w-full bg-zinc-900 border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-white/30" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">Last Name</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" required className="w-full bg-zinc-900 border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-white/30" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full bg-zinc-900 border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-white/30" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" required className="w-full bg-zinc-900 border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-white/30" />
          </div>
        </div>
      </div>

      {/* Exchange Vehicle Details */}
      <div className="space-y-4">
        <h3 className="text-sm uppercase tracking-widest text-white border-b border-white/10 pb-2">Your Vehicle Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">Registration</label>
            <input value={userRegistration} onChange={(e) => setUserRegistration(e.target.value)} type="text" required className="w-full bg-zinc-900 border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-white/30 uppercase" placeholder="e.g. AB12 CDE" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">Current Mileage</label>
            <input value={userMileage} onChange={(e) => setUserMileage(e.target.value)} type="number" required className="w-full bg-zinc-900 border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-white/30" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">Make</label>
            <input value={userMake} onChange={(e) => setUserMake(e.target.value)} type="text" required className="w-full bg-zinc-900 border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-white/30" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">Model</label>
            <input value={userModel} onChange={(e) => setUserModel(e.target.value)} type="text" required className="w-full bg-zinc-900 border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-white/30" />
          </div>
        </div>
      </div>

      {/* Existing Valuation */}
      <div className="space-y-4">
        <h3 className="text-sm uppercase tracking-widest text-white border-b border-white/10 pb-2">Recent Valuation (Optional)</h3>
        <div>
          <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-2">Have you had a valuation recently? (£)</label>
          <input value={recentValuation} onChange={(e) => setRecentValuation(e.target.value)} type="number" className="w-full bg-zinc-900 border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-white/30" placeholder="e.g. 5000" />
        </div>
      </div>

      {submitError && <p className="text-sm text-red-400">{submitError}</p>}

      <button disabled={isSubmitting} type="submit" className="w-full md:w-auto bg-white text-black px-12 py-4 text-xs font-semibold tracking-widest uppercase hover:bg-zinc-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex justify-center">
        {isSubmitting ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  )
}
