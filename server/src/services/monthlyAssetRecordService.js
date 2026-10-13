const prisma = require('../lib/prisma')

const createRecord = async (userId, data) => {
  const asset = await prisma.asset.findFirst({
    where: {
      id: data.assetId,
      category: {
        userId: userId,
      },
    },
  })

  if (!asset) {
    throw new Error('Asset not found')
  }

  const record = await prisma.monthlyAssetRecord.create({
    data: {
      assetId: data.assetId,
      month: new Date(data.month),
      value: data.value,
      moneyAdded: data.moneyAdded ?? 0,
      moneyRemoved: data.moneyRemoved ?? 0,
      income: data.income ?? 0,
    },
  })

  return record
}

const getRecords = async (userId) => {
  const records = await prisma.monthlyAssetRecord.findMany({
    where: {
      asset: {
        category: {
          userId: userId,
        },
      },
    },
    include: {
      asset: true,
    },
    orderBy: {
      month: 'desc',
    },
  })

  return records
}

const getRecord = async (userId, id) => {
  const record = await prisma.monthlyAssetRecord.findFirst({
    where: {
      id: id,
      asset: {
        category: {
          userId: userId,
        },
      },
    },
    include: {
      asset: true,
    },
  })

  if (!record) {
    throw new Error('Monthly asset record not found')
  }

  return record
}

const updateRecord = async (userId, id, data) => {
  const record = await prisma.monthlyAssetRecord.findFirst({
    where: {
      id: id,
      asset: {
        category: {
          userId: userId,
        },
      },
    },
  })

  if (!record) {
    throw new Error('Monthly asset record not found')
  }

  const updatedRecord = await prisma.monthlyAssetRecord.update({
    where: {
      id: id,
    },
    data: {
      ...(data.month !== undefined && {
        month: new Date(data.month),
      }),

      ...(data.value !== undefined && {
        value: data.value,
      }),

      ...(data.moneyAdded !== undefined && {
        moneyAdded: data.moneyAdded,
      }),

      ...(data.moneyRemoved !== undefined && {
        moneyRemoved: data.moneyRemoved,
      }),

      ...(data.income !== undefined && {
        income: data.income,
      }),
    },
  })

  return updatedRecord
}

const deleteRecord = async (userId, id) => {
  const record = await prisma.monthlyAssetRecord.findFirst({
    where: {
      id: id,
      asset: {
        category: {
          userId: userId,
        },
      },
    },
  })

  if (!record) {
    throw new Error('Monthly asset record not found')
  }

  await prisma.monthlyAssetRecord.delete({
    where: {
      id: id,
    },
  })

  return {
    message: 'Monthly asset record deleted successfully',
  }
}

module.exports = {
  createRecord,
  getRecords,
  getRecord,
  updateRecord,
  deleteRecord,
}