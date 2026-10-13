const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const assetService = require('../services/assetService')

const router = express.Router()

router.post('/', authMiddleware, async (req, res) => {
  try {
    const asset = await assetService.createAsset(
      req.user.id,
      req.body
    )

    return res.status(201).json(asset)
  } catch (error) {
    console.error('Failed to create asset:', error.message)

    if (error.message === 'Category not found') {
      return res.status(404).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message: 'Failed to create asset',
    })
  }
})


router.get('/', authMiddleware, async (req, res) => {
  try {
    const assets = await assetService.getAssets(
      req.user.id
    )

    return res.status(200).json(assets)
  } catch (error) {
    console.error('Failed to get assets:', error.message)

    return res.status(500).json({
      message: 'Failed to get assets',
    })
  }
})


router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const asset = await assetService.getAsset(
      req.user.id,
      req.params.id
    )

    return res.status(200).json(asset)
  } catch (error) {
    console.error('Failed to get asset:', error.message)

    if (error.message === 'Asset not found') {
      return res.status(404).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message: 'Failed to get asset',
    })
  }
})


router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const asset = await assetService.updateAsset(
      req.user.id,
      req.params.id,
      req.body.name
    )

    return res.status(200).json(asset)
  } catch (error) {
    console.error('Failed to update asset:', error.message)

    if (
      error.message === 'Asset not found' ||
      error.message === 'Category not found'
    ) {
      return res.status(404).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message: 'Failed to update asset',
    })
  }
})


router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await assetService.deleteAsset(
      req.user.id,
      req.params.id
    )

    return res.status(200).json(result)
  } catch (error) {
    console.error('Failed to delete asset:', error.message)

    if (error.message === 'Asset not found') {
      return res.status(404).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message: 'Failed to delete asset',
    })
  }
})

module.exports = router