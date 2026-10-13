
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getAssets } from '../services/assetService'
import { createMonthlyRecord } from '../services/monthlyAssetRecordService'

function AddMonthlyRecord() {
  const navigate = useNavigate()

  const [assets, setAssets] = useState([])
  const [loadingAssets, setLoadingAssets] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    assetId: '',
    month: '',
    value: '',
    moneyAdded: '',
    moneyRemoved: '',
    income: '',
  })

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const data = await getAssets()
        setAssets(data)
      } catch (error) {
        setError(error.message || 'Failed to load assets')
      } finally {
        setLoadingAssets(false)
      }
    }

    loadAssets()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.assetId) {
      setError('Please select an asset')
      return
    }

    if (!form.month) {
      setError('Please select a month')
      return
    }

    if (!form.value) {
      setError('Please enter the asset value')
      return
    }

    const moneyAdded = form.moneyAdded || '0'
    const moneyRemoved = form.moneyRemoved || '0'
    const income = form.income || '0'

    if (
      Number(form.value) < 0 ||
      Number(moneyAdded) < 0 ||
      Number(moneyRemoved) < 0 ||
      Number(income) < 0
    ) {
      setError('Amounts cannot be negative')
      return
    }

    try {
      setSaving(true)

      await createMonthlyRecord({
        assetId: form.assetId,
        month: form.month,
        value: form.value,
        moneyAdded,
        moneyRemoved,
        income,
      })

      navigate('/history')
    } catch (error) {
      setError(error.message || 'Failed to create monthly record')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/history')}
          className="mb-3 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to History
        </button>

        <h1 className="text-2xl font-bold tracking-tight">
          Add Monthly Record
        </h1>

        <p className="mt-1 text-muted-foreground">
          Record the value and cash flows for an asset for a specific month.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Monthly Asset Record
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Enter the information for this month's asset performance.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="assetId"
              className="text-sm font-medium"
            >
              Asset
            </label>

            <select
              id="assetId"
              name="assetId"
              value={form.assetId}
              onChange={handleChange}
              disabled={loadingAssets || saving}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">
                {loadingAssets
                  ? 'Loading assets...'
                  : 'Select an asset'}
              </option>

              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="month"
              className="text-sm font-medium"
            >
              Month
            </label>

            <input
              id="month"
              name="month"
              type="date"
              value={form.month}
              onChange={handleChange}
              disabled={saving}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="value"
              className="text-sm font-medium"
            >
              Asset Value
            </label>

            <input
              id="value"
              name="value"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.value}
              onChange={handleChange}
              disabled={saving}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="moneyAdded"
                className="text-sm font-medium"
              >
                Money Added
              </label>

              <input
                id="moneyAdded"
                name="moneyAdded"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.moneyAdded}
                onChange={handleChange}
                disabled={saving}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="moneyRemoved"
                className="text-sm font-medium"
              >
                Money Removed
              </label>

              <input
                id="moneyRemoved"
                name="moneyRemoved"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.moneyRemoved}
                onChange={handleChange}
                disabled={saving}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="income"
              className="text-sm font-medium"
            >
              Income
            </label>

            <input
              id="income"
              name="income"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.income}
              onChange={handleChange}
              disabled={saving}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />

            <p className="text-sm text-muted-foreground">
              Include dividends, interest, or other income received
              from this asset during the month.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/history')}
              disabled={saving}
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || loadingAssets}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMonthlyRecord

