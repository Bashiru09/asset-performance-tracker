const prisma = require('../lib/prisma')

const getMonthlySummary = async (userId, month) => {
  const selectedMonth = new Date(month)

  if (isNaN(selectedMonth.getTime())) {
    throw new Error('Invalid month')
  }

  const assets = await prisma.asset.findMany({
    where: {
      category: {
        userId: userId,
      },
    },
    select: {
      id: true,
    },
  })

  let totalValue = 0
  let assetCount = 0

  for (const asset of assets) {
    
    const record = await prisma.monthlyAssetRecord.findFirst({
      where: {
        assetId: asset.id,
        month: {
          lte: selectedMonth,
        },
      },
      orderBy: {
        month: 'desc',
      },
    })

    if (record) {
      totalValue += Number(record.value)
      assetCount++
    }
  }

  return {
    month: month,
    totalValue: totalValue.toString(),
    assetCount: assetCount,
  }
}



const getCategorySummary = async (userId, month) => {
  const selectedMonth = new Date(month)

  if (isNaN(selectedMonth.getTime())) {
    throw new Error('Invalid month')
  }

  const categories = await prisma.category.findMany({
    where: {
      userId: userId,
    },
    include: {
      assets: {
        select: {
          id: true,
        },
      },
    },
  })

  const categorySummaries = []

  for (const category of categories) {
    let totalValue = 0
    let assetCount = 0

    for (const asset of category.assets) {
      const record = await prisma.monthlyAssetRecord.findFirst({
        where: {
          assetId: asset.id,
          month: {
            lte: selectedMonth,
          },
        },
        orderBy: {
          month: 'desc',
        },
      })

      if (record) {
        totalValue += Number(record.value)
        assetCount++
      }
    }

    categorySummaries.push({
      categoryId: category.id,
      categoryName: category.name,
      totalValue: totalValue,
      assetCount: assetCount,
    })
  }

  return {
    month: month,
    categories: categorySummaries,
  }
}



const getPortfolioPerformance = async (userId, month) => {
  const selectedMonth = new Date(month)

  if (isNaN(selectedMonth.getTime())) {
    throw new Error('Invalid month')
  }

  // Get the previous month
  const previousMonth = new Date(selectedMonth)
  previousMonth.setUTCMonth(previousMonth.getUTCMonth() - 1)

  // Get all assets belonging to the logged-in user
  const assets = await prisma.asset.findMany({
    where: {
      category: {
        userId: userId,
      },
    },
    select: {
      id: true,
    },
  })

  let currentValue = 0
  let previousValue = 0
  let moneyAdded = 0
  let moneyRemoved = 0
  let income = 0

  for (const asset of assets) {

    const currentRecord =
      await prisma.monthlyAssetRecord.findFirst({
        where: {
          assetId: asset.id,
          month: {
            lte: selectedMonth,
          },
        },
        orderBy: {
          month: 'desc',
        },
      })

    if (currentRecord) {
      currentValue += Number(currentRecord.value)
    }


    const previousRecord =
      await prisma.monthlyAssetRecord.findFirst({
        where: {
          assetId: asset.id,
          month: {
            lte: previousMonth,
          },
        },
        orderBy: {
          month: 'desc',
        },
      })

    if (previousRecord) {
      previousValue += Number(previousRecord.value)
    }


    const currentMonthRecord =
      await prisma.monthlyAssetRecord.findFirst({
        where: {
          assetId: asset.id,
          month: selectedMonth,
        },
      })

    if (currentMonthRecord) {
      moneyAdded += Number(currentMonthRecord.moneyAdded)
      moneyRemoved += Number(currentMonthRecord.moneyRemoved)
      income += Number(currentMonthRecord.income)
    }
  }

  const gain =
    currentValue -
    previousValue -
    moneyAdded +
    moneyRemoved

  let returnPercentage = 0

  if (previousValue !== 0) {
    returnPercentage =
      (gain / previousValue) * 100
  }

  return {
    month: month,
    previousValue: previousValue,
    currentValue: currentValue,
    moneyAdded: moneyAdded,
    moneyRemoved: moneyRemoved,
    income: income,
    gain: gain,
    returnPercentage: returnPercentage,
  }
}


const getPortfolioHistory = async (userId, from, to) => {
  const startDate = new Date(from)
  const endDate = new Date(to)

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Invalid date range')
  }

  if (startDate > endDate) {
    throw new Error('From date must be before to date')
  }

  const assets = await prisma.asset.findMany({
    where: {
      category: {
        userId: userId,
      },
    },
    select: {
      id: true,
    },
  })

  const history = []

  const currentMonth = new Date(
    Date.UTC(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth(),
      1
    )
  )

  const lastMonth = new Date(
    Date.UTC(
      endDate.getUTCFullYear(),
      endDate.getUTCMonth(),
      1
    )
  )

  while (currentMonth <= lastMonth) {
    let totalValue = 0

    for (const asset of assets) {
      const record = await prisma.monthlyAssetRecord.findFirst({
        where: {
          assetId: asset.id,
          month: {
            lte: currentMonth,
          },
        },
        orderBy: {
          month: 'desc',
        },
      })

      if (record) {
        totalValue += Number(record.value)
      }
    }

    history.push({
      month: currentMonth.toISOString().slice(0, 7),
      totalValue,
    })

    currentMonth.setUTCMonth(currentMonth.getUTCMonth() + 1)
  }

  return {
    from,
    to,
    history,
  }
}



module.exports = {
  getMonthlySummary,
  getCategorySummary,
  getPortfolioPerformance,
  getPortfolioHistory
}