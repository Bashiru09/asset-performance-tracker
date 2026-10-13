import { useEffect, useState } from 'react'
import {
  Plus,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import {
  getMonthlySummary,
  getCategorySummary,
  getPortfolioPerformance,
} from '../services/portfolioService'

function Portfolio() {
  const navigate = useNavigate()

  const [summary, setSummary] = useState(null)
  const [categories, setCategories] = useState([])
  const [performance, setPerformance] = useState(null)

  const [expandedCategory, setExpandedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const now = new Date()

  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, '0')}-01`

  const monthLabel = now.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setLoading(true)
        setError('')

        const [
          summaryData,
          categoryData,
          performanceData,
        ] = await Promise.all([
          getMonthlySummary(currentMonth),
          getCategorySummary(currentMonth),
          getPortfolioPerformance(currentMonth),
        ])

        setSummary(summaryData)
        setCategories(categoryData.categories || [])
        setPerformance(performanceData)
      } catch (error) {
        console.error('Failed to load portfolio:', error)
        setError(error.message || 'Failed to load portfolio')
      } finally {
        setLoading(false)
      }
    }

    loadPortfolio()
  }, [currentMonth])

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString('en-GH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const formatPercentage = (value) => {
    return `${Number(value || 0).toFixed(2)}%`
  }

  const getCategoryPercentage = (value) => {
    if (!summary?.totalValue) {
      return 0
    }

    return (Number(value) / Number(summary.totalValue)) * 100
  }

  const categoryColors = [
    '#18181b',
    '#52525b',
    '#71717a',
    '#a1a1aa',
    '#d4d4d8',
  ]

  const getCategoryColor = (index) => {
    return categoryColors[index % categoryColors.length]
  }

  const createDonutBackground = () => {
    if (!categories.length || !summary?.totalValue) {
      return '#e4e4e7'
    }

    let currentPercentage = 0

    const segments = categories.map((category, index) => {
      const percentage = getCategoryPercentage(category.totalValue)

      const start = currentPercentage
      currentPercentage += percentage

      return `${getCategoryColor(index)} ${start}% ${currentPercentage}%`
    })

    return `conic-gradient(${segments.join(', ')})`
  }

  const toggleCategory = (categoryId) => {
    setExpandedCategory((current) =>
      current === categoryId ? null : categoryId
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">
            Portfolio
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Where your money sits, {monthLabel}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
          <p className="text-sm text-zinc-500">
            Loading portfolio...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">
            Portfolio
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Where your money sits, {monthLabel}
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  const isPositive = Number(performance?.returnPercentage || 0) >= 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">
            Portfolio
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Where your money sits, {monthLabel}
          </p>
        </div>

        <button
          onClick={() => navigate('/history/new')}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          <Plus size={17} />
          Add monthly record
        </button>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[400px_1fr]">
        {/* Allocation */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex justify-center">
            <div
              className="relative flex h-60 w-60 items-center justify-center rounded-full"
              style={{
                background: createDonutBackground(),
              }}
            >
              <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-xs text-zinc-500">
                  Total
                </span>

                <span className="mt-1 text-2xl font-semibold text-zinc-900">
                  GH₵{formatMoney(summary?.totalValue)}
                </span>
              </div>
            </div>
          </div>

          {/* Category legend */}
          <div className="mt-6 space-y-1">
            {categories.map((category, index) => {
              const percentage = getCategoryPercentage(
                category.totalValue
              )

              return (
                <div
                  key={category.categoryId}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{
                        backgroundColor:
                          getCategoryColor(index),
                      }}
                    />

                    <span className="text-sm text-zinc-600">
                      {category.categoryName}
                    </span>
                  </div>

                  <span className="text-sm font-medium text-zinc-900">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              )
            })}

            {!categories.length && (
              <p className="py-3 text-center text-sm text-zinc-500">
                No categories with recorded values yet.
              </p>
            )}
          </div>
        </div>

        {/* Category cards */}
        <div className="space-y-3">
          {categories.map((category, index) => {
            const percentage = getCategoryPercentage(
              category.totalValue
            )

            const expanded =
              expandedCategory === category.categoryId

            return (
              <div
                key={category.categoryId}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
              >
                <button
                  onClick={() =>
                    toggleCategory(category.categoryId)
                  }
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-zinc-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor:
                          getCategoryColor(index),
                      }}
                    />

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-zinc-900">
                          {category.categoryName}
                        </span>

                        <span className="text-sm text-zinc-500">
                          {category.assetCount}{' '}
                          {category.assetCount === 1
                            ? 'asset'
                            : 'assets'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold text-zinc-900">
                        GH₵{formatMoney(category.totalValue)}
                      </div>

                      <div className="text-xs text-zinc-500">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>

                    {expanded ? (
                      <ChevronDown
                        size={18}
                        className="text-zinc-400"
                      />
                    ) : (
                      <ChevronRight
                        size={18}
                        className="text-zinc-400"
                      />
                    )}
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-zinc-100 bg-zinc-50 px-5 py-4">
                    <p className="text-sm text-zinc-500">
                      {category.assetCount === 0
                        ? 'No assets in this category yet.'
                        : `${category.assetCount} ${
                            category.assetCount === 1
                              ? 'asset'
                              : 'assets'
                          } in this category.`}
                    </p>
                  </div>
                )}
              </div>
            )
          })}

          {!categories.length && (
            <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
              <p className="text-sm text-zinc-500">
                No portfolio categories available yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Performance summary */}
      {performance && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-zinc-900">
              Performance
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Portfolio performance for {monthLabel}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-xs text-zinc-500">
                Previous value
              </p>

              <p className="mt-1 font-semibold text-zinc-900">
                GH₵{formatMoney(performance.previousValue)}
              </p>
            </div>

            <div>
              <p className="text-xs text-zinc-500">
                Current value
              </p>

              <p className="mt-1 font-semibold text-zinc-900">
                GH₵{formatMoney(performance.currentValue)}
              </p>
            </div>

            <div>
              <p className="text-xs text-zinc-500">
                Net gain
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                {isPositive ? (
                  <TrendingUp
                    size={16}
                    className="text-emerald-600"
                  />
                ) : (
                  <TrendingDown
                    size={16}
                    className="text-red-600"
                  />
                )}

                <span
                  className={`font-semibold ${
                    isPositive
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}
                >
                  GH₵{formatMoney(performance.gain)}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-zinc-500">
                Return
              </p>

              <p
                className={`mt-1 font-semibold ${
                  isPositive
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}
              >
                {formatPercentage(
                  performance.returnPercentage
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Portfolio