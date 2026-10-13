const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const monthlyAssetRecordService = require('../services/monthlyAssetRecordService')

const router = express.Router()

router.post('/', authMiddleware, async (req, res) => {
  try {
    const record = await monthlyAssetRecordService.createRecord(
      req.user.id,
      req.body
    )

    return res.status(201).json(record)
  } catch (error) {
    console.error(
      'Failed to create monthly asset record:',
      error.message
    )

    if (error.message === 'Asset not found') {
      return res.status(404).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message: 'Failed to create monthly asset record',
    })
  }
})


router.get('/', authMiddleware, async (req, res) => {
  try {
    const records = await monthlyAssetRecordService.getRecords(
      req.user.id
    )

    return res.status(200).json(records)
  } catch (error) {
    console.error(
      'Failed to get monthly asset records:',
      error.message
    )

    return res.status(500).json({
      message: 'Failed to get monthly asset records',
    })
  }
})



router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const record = await monthlyAssetRecordService.getRecord(
      req.user.id,
      req.params.id
    )

    return res.status(200).json(record)
  } catch (error) {
    console.error(
      'Failed to get monthly asset record:',
      error.message
    )

    if (error.message === 'Monthly asset record not found') {
      return res.status(404).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message: 'Failed to get monthly asset record',
    })
  }
})


router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const record = await monthlyAssetRecordService.updateRecord(
      req.user.id,
      req.params.id,
      req.body
    )

    return res.status(200).json(record)
  } catch (error) {
    console.error(
      'Failed to update monthly asset record:',
      error.message
    )

    if (error.message === 'Monthly asset record not found') {
      return res.status(404).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message: 'Failed to update monthly asset record',
    })
  }
})


router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await monthlyAssetRecordService.deleteRecord(
      req.user.id,
      req.params.id
    )

    return res.status(200).json(result)
  } catch (error) {
    console.error(
      'Failed to delete monthly asset record:',
      error.message
    )

    if (error.message === 'Monthly asset record not found') {
      return res.status(404).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message: 'Failed to delete monthly asset record',
    })
  }
})

module.exports = router