const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const portfolioService = require('../services/portfolioService')

const router = express.Router()

router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const { month } = req.query

    if (!month) {
      return res.status(400).json({
        message: 'Month is required',
      })
    }

    const summary = await portfolioService.getMonthlySummary(
      req.user.id,
      month
    )

    return res.status(200).json(summary)
  } catch (error) {
    console.error(
      'Failed to get portfolio summary:',
      error.message
    )

    if (error.message === 'Invalid month') {
      return res.status(400).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message: 'Failed to get portfolio summary',
    })
  }
})


router.get('/category-summary', authMiddleware, async (req, res) => {
  try {
    const { month } = req.query

    if (!month) {
      return res.status(400).json({
        message: 'Month is required',
      })
    }

    const summary = await portfolioService.getCategorySummary(
      req.user.id,
      month
    )

    return res.status(200).json(summary)
  } catch (error) {
    console.error(
      'Failed to get category summary:',
      error.message
    )

    if (error.message === 'Invalid month') {
      return res.status(400).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message: 'Failed to get category summary',
    })
  }
})



router.get('/performance', authMiddleware, async (req, res) => {
  try {
    const { month } = req.query

    if (!month) {
      return res.status(400).json({
        message: 'Month is required',
      })
    }

    const performance =
      await portfolioService.getPortfolioPerformance(
        req.user.id,
        month
      )

    return res.status(200).json(performance)
  } catch (error) {
    console.error(
      'Failed to get portfolio performance:',
      error.message
    )

    if (error.message === 'Invalid month') {
      return res.status(400).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message: 'Failed to get portfolio performance',
    })
  }
})



router.get('/history', authMiddleware, async (req, res) => {
  try {
    const { from, to } = req.query

    if (!from || !to) {
      return res.status(400).json({
        message: 'From and to dates are required',
      })
    }

    const history = await portfolioService.getPortfolioHistory(
      req.user.id,
      from,
      to
    )

    return res.status(200).json(history)
  } catch (error) {
    console.error('Failed to get portfolio history:', error.message)

    if (
      error.message === 'Invalid date range' ||
      error.message === 'From date must be before to date'
    ) {
      return res.status(400).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message: 'Failed to get portfolio history',
    })
  }
})



module.exports = router