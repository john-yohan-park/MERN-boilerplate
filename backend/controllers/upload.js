const express      = require('express')
const router       = express.Router()
const csv          = require('csvtojson')
const ServiceOwner = require('../models/service_owner')
const SCO          = require('../models/sco')
const Admin        = require('../models/admin')
const Quarter      = require('../models/quarter')
const _            = require('lodash')

// POST
// localhost:8080/api/upload/admins
router.post('/admins', (req, res) => {
  try { uploadAdmin('database/source/admin.csv', Admin) }
  catch (e) { res.status(500).send({ msg : "error uploading 'admin.csv' to Mongo" }) }
  res.status(200).send({ msg : "finished uploading 'scos.csv' to Mongo" })
})

// POST
// localhost:8080/api/upload/quarters
router.post('/quarters', (req, res) => {
  try { uploadQuarter() }
  catch (e) { res.status(500).send({ msg : "error uploading 'quarter.csv' to Mongo" }) }
  res.status(200).send({ msg : "finished uploading 'quarter.csv' to Mongo" })
})

module.exports = router

//----------------------------------
//        HELPER FUNCTIONS    
//----------------------------------

async function uploadAdmin(filePath, Schema) {
  const admins = await csv().fromFile(filePath)
  for (let admin of admins) {
    new Schema(admin).save()
  }
}

async function uploadQuarter() {
  const quarters = await csv().fromFile('database/source/quarter.csv')
  for (let row of quarters) {

    row.start = (new Date(row.start)).toISOString()
    row.end   = (new Date(row.end)).toISOString()

    if (row.year==='2021' && row.quarter==='Q1') {
      const services = await csv().fromFile('database/source/FY21_Q1.csv')
      row.services      = services
      const password    = 'password'
      let scos          = []
      let serviceOwners = []
      for (let service of services) {
        const { service_owner_first_name, service_owner_last_name, service_owner_username, sco_first_name, sco_last_name, sco_username } = service
        serviceOwners.push({
          first_name : service_owner_first_name,
          last_name  : service_owner_last_name ,
          username   : service_owner_username  ,
          password
        })
        scos.push({
          first_name : sco_first_name,
          last_name  : sco_last_name ,
          username   : sco_username  ,
          password
        })
      }
      serviceOwners = _.uniqBy(serviceOwners, 'username')
      scos          = _.uniqBy(scos, 'username')

      const year = row.year
      const quarter = row.quarter
      await new SCO({ year, quarter, scos }).save()
      await new ServiceOwner({ year, quarter, serviceOwners }).save()
    }
    else {
      row.services = []
    }
    new Quarter(row).save()
  }
}