const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const categoryService = require('../services/categoryService')


const router = express.Router()


router.post('/', authMiddleware, async (req, res) => {
  try {
    const category = await categoryService.createCategory(
      req.body.name,
      req.user.id
    )

    return res.status(201).json(category)
  } catch (error) {
    console.error('Failed to create category:', error.message)

    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : 'Failed to create category',
    })
  }
})


router.get('/', authMiddleware, async (req, res) => {
  try {
    const categories = await categoryService.getCategories(
      req.user.id
    )

    return res.status(200).json(categories)
  } catch (error) {
    console.error('Failed to get categories:', error.message)

    return res.status(500).json({
      message: 'Failed to get categories',
    })
  }
})


router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await categoryService.deleteCategory(
      req.params.id
    )

    return res.status(200).json(result)
  } catch (error) {
    console.error('Failed to delete category:', error.message)

    if (error.message === 'Category not found') {
      return res.status(404).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message: 'Failed to delete category',
    })
  }
})


router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body
    )

    return res.status(200).json(category)
  } catch (error) {
    console.error('Failed to update category:', error.message)

    if (error.message === 'Category not found') {
      return res.status(404).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message: 'Failed to update category',
    })
  }
})

module.exports = router