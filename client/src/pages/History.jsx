import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getMonthlyRecords } from '../services/monthlyAssetRecordService'
import { getAssets } from '../services/assetService'

function History() {
  const navigate = useNavigate()

  const [records, setRecords] = useState([])
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const [recordsData, assetsData] = await Promise.all([
          getMonthlyRecords(),
          getAssets(),
        ])

        setRecords(recordsData)
        setAssets(assetsData)
      } catch (error) {
        setError(error.message || 'Failed to load history')
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  const getAssetName = (assetId) => {
    const asset = assets.find((asset) => asset.id === assetId)

    return asset?.name || 'Unknown Asset'
  }

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const formatMonth = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            History
          </h1>

          <p className="mt-1 text-muted-foreground">
            View your monthly asset values and cash flows.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/history/new')}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + Add Monthly Record
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          Loading history...
        </div>
      ) : records.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center">
          <h2 className="text-lg font-semibold">
            No monthly records yet
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Start tracking your asset performance by adding your first
            monthly record.
          </p>

          <button
            type="button"
            onClick={() => navigate('/history/new')}
            className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Add Monthly Record
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    Month
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Asset
                  </th>

                  <th className="px-4 py-3 text-right font-medium">
                    Value
                  </th>

                  <th className="px-4 py-3 text-right font-medium">
                    Money Added
                  </th>

                  <th className="px-4 py-3 text-right font-medium">
                    Money Removed
                  </th>

                  <th className="px-4 py-3 text-right font-medium">
                    Income
                  </th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b last:border-0"
                  >
                    <td className="px-4 py-4">
                      {formatMonth(record.month)}
                    </td>

                    <td className="px-4 py-4 font-medium">
                      {getAssetName(record.assetId)}
                    </td>

                    <td className="px-4 py-4 text-right">
                      {formatMoney(record.value)}
                    </td>

                    <td className="px-4 py-4 text-right">
                      {formatMoney(record.moneyAdded)}
                    </td>

                    <td className="px-4 py-4 text-right">
                      {formatMoney(record.moneyRemoved)}
                    </td>

                    <td className="px-4 py-4 text-right">
                      {formatMoney(record.income)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default History