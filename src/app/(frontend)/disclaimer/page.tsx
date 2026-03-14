import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer | MWA autos',
  description: 'View the disclaimer policy for MWA autos website and services.',
}

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#111111] text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl tracking-[0.2em] font-light uppercase mb-12 border-b border-zinc-800 pb-8">
          Disclaimer
        </h1>
        
        <div className="space-y-8 text-zinc-300 font-light leading-relaxed text-sm md:text-base">
          <p>
            The information contained on this website is for general information purposes only. The information is provided by MWA autos, and while we endeavour to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.
          </p>
          
          <h2 className="text-xl tracking-widest uppercase font-semibold text-white mt-12 mb-6">Website Usage</h2>
          <p>
            In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
          </p>

          <h2 className="text-xl tracking-widest uppercase font-semibold text-white mt-12 mb-6">Vehicle Information</h2>
          <p>
            Every effort has been made to ensure the accuracy of the vehicle information above and pricing, but errors may occur. For absolute certainty about the vehicle specifications or features, please double-check with a member of our sales team directly before purchasing.
          </p>

          <h2 className="text-xl tracking-widest uppercase font-semibold text-white mt-12 mb-6">External Links</h2>
          <p>
            Through this website, you are able to link to other websites which are not under the control of MWA autos. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
          </p>
        </div>
      </div>
    </main>
  )
}
