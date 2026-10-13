require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: 'http://localhost:5173',
}))

app.use(express.json())


const categoryRoutes = require('./src/routes/categoryRoutes')
app.use('/api/v1/categories', categoryRoutes)


const assetRoutes = require('./src/routes/assetRoutes')
app.use('/api/v1/assets', assetRoutes)


const monthlyAssetRecordRoutes = require('./src/routes/monthlyAssetRecordRoutes')

app.use('/api/v1/monthly-asset-records', monthlyAssetRecordRoutes)


const portfolioRoutes = require('./src/routes/portfolioRoutes')
app.use('/api/v1/portfolios', portfolioRoutes)





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})