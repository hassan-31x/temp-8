'use client'

import React from 'react'
import { Button } from './button'

interface SyncConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (overrideDescriptionAndPrice: boolean) => void
  isLoading: boolean
}

export const SyncConfirmationModal: React.FC<SyncConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  if (!isOpen) return null

  const handleOverrideConfirm = () => {
    onConfirm(true)
  }

  const handlePreserveConfirm = () => {
    onConfirm(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sync with AutoTrader
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            This will sync all vehicle data from AutoTrader. How would you like to handle custom descriptions and prices?
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="p-3 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-1">Option 1: Override Custom Data</h4>
            <p className="text-sm text-gray-600">
              Replace custom descriptions and prices with AutoTrader data. Reserve prices will be preserved.
            </p>
          </div>

          <div className="p-3 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-1">Option 2: Preserve Custom Data</h4>
            <p className="text-sm text-gray-600">
              Keep existing custom descriptions and prices. Only update other vehicle data.
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={handleOverrideConfirm}
            disabled={isLoading}
            variant="destructive"
            className="flex-1"
          >
            {isLoading ? 'Syncing...' : 'Override Custom Data'}
          </Button>

          <Button
            onClick={handlePreserveConfirm}
            disabled={isLoading}
            variant="default"
            className="flex-1"
          >
            {isLoading ? 'Syncing...' : 'Preserve Custom Data'}
          </Button>
        </div>

        {!isLoading && (
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full mt-3"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  )
}
