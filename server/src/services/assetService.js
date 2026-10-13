const prisma = require('../lib/prisma')

const createAsset = async (userId, data) => {
  const category = await prisma.category.findFirst({
    where: {
      id: data.categoryId,
      userId: userId,
    },
  })

  if (!category) {
    throw new Error('Category not found')
  }

  const asset = await prisma.asset.create({
    data: {
      categoryId: data.categoryId,
      name: data.name,
    },
  })

  return asset
}

const getAssets = async (userId) => {
  const assets = await prisma.asset.findMany({
    where: {
      category: {
        userId: userId,
      },
    },
    include: {
      category: true,
    },
  })

  return assets
}

const getAsset = async (userId, id) => {
  const asset = await prisma.asset.findFirst({
    where: {
      id: id,
      category: {
        userId: userId,
      },
    },
    include: {
      category: true,
    },
  })

  if (!asset) {
    throw new Error('Asset not found')
  }

  return asset
}

const updateAsset = async (userId, id, data) => {
  const asset = await prisma.asset.findFirst({
    where: {
      id: id,
      category: {
        userId: userId,
      },
    },
  })

  if (!asset) {
    throw new Error('Asset not found')
  }

  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        userId: userId,
      },
    })

    if (!category) {
      throw new Error('Category not found')
    }
  }

  const updatedAsset = await prisma.asset.update({
    where: {
      id: id,
    },
    data: {
      ...(data.name !== undefined && {
        name: data.name,
      }),

      ...(data.categoryId !== undefined && {
        categoryId: data.categoryId,
      }),
    },
  })

  return updatedAsset
}

const deleteAsset = async (userId, id) => {
  const asset = await prisma.asset.findFirst({
    where: {
      id: id,
      category: {
        userId: userId,
      },
    },
  })

  if (!asset) {
    throw new Error('Asset not found')
  }

  await prisma.asset.delete({
    where: {
      id: id,
    },
  })

  return {
    message: 'Asset deleted successfully',
  }
}

module.exports = {
  createAsset,
  getAssets,
  getAsset,
  updateAsset,
  deleteAsset,
}