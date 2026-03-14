'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'

import './index.scss'

interface SyncResult {
  success: boolean
  createdCount?: number
  updatedCount?: number
  deletedCount?: number
  errorCount?: number
}

const SuccessMessage: React.FC<{ result: SyncResult }> = ({ result }) => (
  <div>
    <div>AutoTrader sync completed!</div>
    {result.createdCount !== undefined && (
      <div className="text-sm mt-1">
        Created: {result.createdCount}, Updated: {result.updatedCount}, Deleted: {result.deletedCount}, Errors: {result.errorCount}
      </div>
    )}
    <div className="mt-2">
      You can now{' '}
      <a target="_blank" href="/">
        visit your website
      </a>
    </div>
  </div>
)

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const [showOptions, setShowOptions] = useState(false)
  const [lastResult, setLastResult] = useState<SyncResult | null>(null)

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (loading) {
        toast.info('Sync already in progress.')
        return
      }
      if (error) {
        toast.error(`An error occurred, please refresh and try again.`)
        return
      }

      setShowOptions(true)
    },
    [loading, error],
  )

  const handleSync = useCallback(
    async (overrideDescriptionAndPrice: boolean) => {
      setLoading(true)
      setShowOptions(false)

      try {
        const syncPromise = new Promise<SyncResult>((resolve, reject) => {
          try {
            fetch('/next/seed', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ overrideDescriptionAndPrice })
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.success) {
                  resolve(data)
                  setSeeded(true)
                  setLastResult(data)
                } else {
                  reject('An error occurred while syncing.')
                }
              })
              .catch((error) => {
                reject(error)
              })
          } catch (error) {
            reject(error)
          }
        })

        toast.promise(
          syncPromise,
          {
            loading: 'Syncing with AutoTrader...',
            success: (result) => <SuccessMessage result={result} />,
            error: 'An error occurred while syncing.',
          },
        )

        await syncPromise
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err)
        setError(error)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const handleCancel = useCallback(() => {
    setShowOptions(false)
  }, [])

  let message = ''
  if (loading) message = ' Syncing...'
  if (seeded && lastResult) {
    message = ` Last sync: +${lastResult.createdCount} created, +${lastResult.updatedCount} updated, -${lastResult.deletedCount} deleted`
  }
  if (error) message = ` Error: ${error}`

  return (
    <div className="seedButtonContainer">
      {!showOptions ? (
        <Fragment>
          <button className="seedButton" onClick={handleClick} disabled={loading}>
            Sync Products with AutoTrader
          </button>
          <span className="seedButtonMessage">
            {message}
          </span>
        </Fragment>
      ) : (
        <div className="syncOptions">
          <div className="syncOptionsHeader">
            <h3>Sync Options</h3>
            <p>Choose how to handle custom descriptions and pricing:</p>
          </div>

          <div className="syncOptionsButtons">
            <button
              className="syncOptionButton preserve"
              onClick={() => handleSync(false)}
              disabled={loading}
            >
              <div className="buttonTitle">Keep Custom Data</div>
              <div className="buttonDescription">Preserve your custom descriptions and pricing</div>
            </button>

            <button
              className="syncOptionButton override"
              onClick={() => handleSync(true)}
              disabled={loading}
            >
              <div className="buttonTitle">Override with AutoTrader</div>
              <div className="buttonDescription">Replace descriptions and pricing with AutoTrader data</div>
            </button>
          </div>

          <button className="cancelButton" onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
