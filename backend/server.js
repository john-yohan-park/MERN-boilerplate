const express = require('express')
const cors    = require('cors')
const mongo   = require('./database/mongo')
const router  = require('./routes/router')

const app = express()
app.use(express.json({limit:'3MB'}))
app.use(express.urlencoded({extended:true}))
app.use(cors())
mongo.connect()

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`backend running on http://localhost:${PORT}`))
router(app)