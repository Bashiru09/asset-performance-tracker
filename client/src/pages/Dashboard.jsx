
import { useEffect, useMemo, useState } from 'react'
import {
  Wallet,
  Layers,
  TrendingUp,
  CalendarDays,
} from 'lucide-react'

import { getAssets } from '../services/assetService'
import { getCategories } from '../services/categoryService'
import { getMonthlyRecords } from '../services/monthlyAssetRecordService'

function Dashboard() {
  const [assets, setAssets] = useState([])
  const [categories, setCategories] = useState([])
  const [records, setRecords] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [assetsData, categoriesData, recordsData] =
          await Promise.all([
            getAssets(),
            getCategories(),
            getMonthlyRecords(),
          ])

        setAssets(assetsData)
        setCategories(categoriesData)
        setRecords(recordsData)
      } catch (error) {
        setError(error.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  /*
   * Get the latest monthly record for every asset.
   */
  const latestRecords = useMemo(() => {
    const latest = {}

    records.forEach((record) => {
      const existing = latest[record.assetId]

      if (
        !existing ||
        new Date(record.month) > new Date(existing.month)
      ) {
        latest[record.assetId] = record
      }
    })

    return Object.values(latest)
  }, [records])

  /*
   * Total current portfolio value.
   */
  const totalValue = useMemo(() => {
    return latestRecords.reduce(
      (total, record) => total + Number(record.value || 0),
      0
    )
  }, [latestRecords])

  /*
   * Calculate total return.

   * For now:
   *
   * Total Return =
   * Current Value
   * - Money Added
   * + Money Removed
   * + Income
   *
   * This will be refined when we implement the full
   * performance calculation across monthly periods.
   */
  const totalReturn = useMemo(() => {
    const totalAdded = records.reduce(
      (total, record) => total + Number(record.moneyAdded || 0),
      0
    )

    const totalRemoved = records.reduce(
      (total, record) => total + Number(record.moneyRemoved || 0),
      0
    )

    const totalIncome = records.reduce(
      (total, record) => total + Number(record.income || 0),
      0
    )

    return totalValue - totalAdded + totalRemoved + totalIncome
  }, [records, totalValue])

  /*
   * Find the latest two portfolio months.
   */
  const monthlyTotals = useMemo(() => {
    const months = {}

    records.forEach((record) => {
      const month = new Date(record.month)
        .toISOString()
        .slice(0, 7)

      if (!months[month]) {
        months[month] = 0
      }

      months[month] += Number(record.value || 0)
    })

    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, value]) => ({
        month,
        value,
      }))
  }, [records])

  const monthlyChange = useMemo(() => {
    if (monthlyTotals.length < 2) {
      return 0
    }

    const current =
      monthlyTotals[monthlyTotals.length - 1].value

    const previous =
      monthlyTotals[monthlyTotals.length - 2].value

    return current - previous
  }, [monthlyTotals])

  /*
   * Group assets by category.
   */
  const portfolioBreakdown = useMemo(() => {
    return categories.map((category) => {
      const categoryAssets = assets.filter(
        (asset) => asset.categoryId === category.id
      )

      const categoryValue = categoryAssets.reduce(
        (total, asset) => {
          const record = latestRecords.find(
            (record) => record.assetId === asset.id
          )

          return total + Number(record?.value || 0)
        },
        0
      )

      return {
        ...category,
        assetCount: categoryAssets.length,
        value: categoryValue,
      }
    })
  }, [categories, assets, latestRecords])

  /*
   * Most recent records for Recent Activity.
   */
  const recentRecords = useMemo(() => {
    return [...records]
      .sort(
        (a, b) =>
          new Date(b.month).getTime() -
          new Date(a.month).getTime()
      )
      .slice(0, 5)
  }, [records])

  const getAssetName = (assetId) => {
    const asset = assets.find(
      (asset) => asset.id === assetId
    )

    return asset?.name || 'Unknown Asset'
  }

  const getCategoryPercentage = (value) => {
    if (totalValue === 0) {
      return 0
    }

    return ((value / totalValue) * 100).toFixed(1)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Dashboard
          </h1>

          <p className="text-muted-foreground">
            Track and understand your asset performance.
          </p>
        </div>

        <div className="rounded-xl border bg-background p-10 text-center text-sm text-muted-foreground">
          Loading dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Track and understand your asset performance.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* KPI CARDS */}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Total Assets
            </p>

            <Layers className="h-4 w-4 text-muted-foreground" />
          </div>

          <p className="mt-2 text-2xl font-bold">
            {assets.length}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Across all categories
          </p>
        </div>

        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Total Value
            </p>

            <Wallet className="h-4 w-4 text-muted-foreground" />
          </div>

          <p className="mt-2 text-2xl font-bold">
            {formatMoney(totalValue)}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Current portfolio value
          </p>
        </div>

        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Total Return
            </p>

            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>

          <p className="mt-2 text-2xl font-bold">
            {formatMoney(totalReturn)}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Overall portfolio performance
          </p>
        </div>

        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Monthly Change
            </p>

            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </div>

          <p className="mt-2 text-2xl font-bold">
            {formatMoney(monthlyChange)}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Change from previous month
          </p>
        </div>
      </section>

      {/* PERFORMANCE */}

      <section className="rounded-xl border bg-background p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Portfolio Performance
            </h2>

            <p className="text-sm text-muted-foreground">
              Track your portfolio value over time.
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            Monthly
          </div>
        </div>

        <div className="mt-6 flex h-72 items-center justify-center rounded-lg border border-dashed">
          {monthlyTotals.length === 0 ? (
            <div className="text-center">
              <p className="text-sm font-medium">
                Performance chart
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Your monthly portfolio performance will appear
                here.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm font-medium">
                {monthlyTotals.length} months recorded
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Chart visualization will be added next.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* BREAKDOWN + ACTIVITY */}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-background p-5">
          <div>
            <h2 className="text-lg font-semibold">
              Portfolio Breakdown
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              See how your portfolio is distributed across
              categories.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {portfolioBreakdown.length === 0 ? (
              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm font-medium">
                  No categories yet
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Create categories and add assets to see your
                  portfolio breakdown.
                </p>
              </div>
            ) : (
              portfolioBreakdown.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {category.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {category.assetCount}{' '}
                      {category.assetCount === 1
                        ? 'asset'
                        : 'assets'}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatMoney(category.value)}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {getCategoryPercentage(category.value)}%
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-background p-5">
          <div>
            <h2 className="text-lg font-semibold">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Your latest asset and portfolio updates will
              appear here.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {recentRecords.length === 0 ? (
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">
                  No recent activity
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Your latest asset and portfolio updates will
                  appear here.
                </p>
              </div>
            ) : (
              recentRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {getAssetName(record.assetId)}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {new Date(
                        record.month
                      ).toLocaleDateString(undefined, {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatMoney(record.value)}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Monthly value
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
