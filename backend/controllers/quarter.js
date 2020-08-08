const Quarter      = require('../models/quarter')
// const ServiceOwner = require('../models/service_owner')
const SCO          = require('../models/sco')
const _            = require('lodash')

// localhost:8080/api/quarters/all
async function getAll(res, res) {
  res.send((await Quarter.find()).filter(doc => doc.services.length > 0).sort((l, r) => {
      if (l.start > r.start) return 1
      if (l.start < r.start) return -1
      return 0
    }
  ))
}

// localhost:8080/api/quarters/all_quarters
async function getAllQuarters(res, res) {
  const all = (await Quarter.find()).sort((l, r) => {
    if (l.start > r.start) return 1
    if (l.start < r.start) return -1
    return 0
  })
  res.send(all.filter(doc => doc.services.length > 0).map(doc => ({
    year    : doc.year,
    quarter : doc.quarter,
    start   : doc.start,
    end     : doc.end,
  })))
}

// localhost:8080/api/quarters/year_and_quarter
async function getPresent(req, res) {
  const now = new Date()
  res.send(await Quarter.findOne(
    { 
      start : { $lte : now },
      end   : { $gt  : now },    
    }))
}

// localhost:8080/api/quarters/quarters
async function getQuarters(req, res) {
  let quarters = (await Quarter.find()).map(obj => obj.quarter)
  quarters = _.uniq(quarters).sort()
  res.send(quarters)
}

// localhost:8080/api/quarters/years
async function getYears(req, res) {
  let years = (await Quarter.find()).map(obj => obj.year)
  years = _.uniq(years).sort()
  res.send(years)
}

// localhost:8080/api/quarters/services/service_owners?username=all&quarter=Q1&year=2021
async function getServices(req, res) {
  const { username, quarter, year } = req.query
  let services = (await Quarter.findOne({ quarter, year })).services
  if (username!=='all') services = services.filter(s => s.service_owner_username===username)
  res.send(services)
}

// localhost:8080/api/quarters/services/role/ ... 
async function getByRole(req, res) {
  const { username, role, quarter, year } = req.query
  let services = (await Quarter.findOne({ quarter, year })).services
  switch (role) {
    case 'service owner':
      services = services.filter(s => s.service_owner_username===username)
      break
    case 'sco':
      services = services.filter(s => s.sco_username===username)
      break
    default:
  }
  res.send(services)
}

// POST
// localhost:8080/api/quarters/services/upload
async function addOneService(req, res) {
  const { newService, quarter, year } = req.body
  await Quarter.updateOne({ quarter, year }, { $push : { services : newService } })
  res.send('added new service')
}

// PUT
// localhost:8080/api/quarters/services/update
async function updateOneService(req, res) {
  const { row, quarter, year } = req.body 
  Object.keys(row).forEach(key => row[key] = row[key][0])
  const _id = row._id
  let services = (await Quarter.findOne( { quarter, year })).services
  services = services.map(s => s._id==_id ? row : s)
  await Quarter.updateOne({quarter, year}, { services })  
  res.status(200).send({ msg : 'updated document' })
}

// POST
// localhost:8080/api/quarters/services/delete
async function deleteOneService(req, res) {
  const { row, quarter, year } = req.body
  const id = row._id[0]
  let services = (await Quarter.findOne( { quarter, year })).services
  services = services.filter(s => s._id != id)
  await Quarter.updateOne({ quarter, year }, { services })
  res.send('deleted service')
}

// PUT
// localhost:8080/api/quarters/services/update_services
async function updateServices(req, res) {
  console.log('called update services!')
  const { _id, quarter, year, start, end, services } = req.body
  await Quarter.updateOne({ _id }, { quarter, year, start, end, services })
  res.send('updated services')
}

// POST
// localhost:8080/api/quarters/services/add_services
async function addServices(req, res) {
  console.log('called add services!')
  const { quarter, year, start, end, services } = req.body
  const fiscalStr = getFiscalStr(quarter, year)
  await addSCOs(services, fiscalStr)
  // await addServiceOwners(services, fiscalStr)
  res.send((await Quarter.create({ year, quarter, start, end, services }))._id)
}

// DELETE
// localhost:8080/api/quarters/services/delete_services
async function deleteServices(req, res) {
  console.log('called delete services!')
  const { _id, quarter, year } = req.query
  const fiscalStr = getFiscalStr(quarter, year)

  const retrievedSCOs = await SCO.find()  // delete SCOs
  for (let scoObj of retrievedSCOs) {
    const { _id } = scoObj
    const updatedAccess = scoObj.access.filter(f => f !== fiscalStr)
    if (updatedAccess.length===0) {
      await SCO.deleteOne({ _id })
    }
    else {
      await SCO.updateOne({ _id }, { $pull : { access : fiscalStr } })
    }
  }
  // const retrievedServiceOwners = await ServiceOwner.find()  // delete Service Owners
  // for (let serviceOwnerObj of retrievedServiceOwners) {
  //   const { _id } = serviceOwnerObj
  //   const updatedAccess = serviceOwnerObj.access.filter(f => f !== fiscalStr)
  //   if (updatedAccess.length===0) {
  //     await ServiceOwner.deleteOne({ _id })
  //   }
  //   else {
  //     await ServiceOwner.updateOne({ _id }, { $pull : { access : fiscalStr } })
  //   }
  // }

  await Quarter.deleteOne({ _id })
  res.send('deleted document')
}

// PUT
// localhost:8080/api/quarters/services/randomize
async function randomizeServices(req, res) {
  const docArr = await Quarter.find()
  docArr.forEach(async doc => {
    const { _id, services } = doc
    if (services.length > 0) {
      
      for (let service of services) {  
        const rand = Math.floor(Math.random() * 13) + 1
        let m
        if (rand < 5) m = 1
        else if (5 < rand && rand < 10) m = 2
        else m = 3
        service.completed_month = `M${m}`
        service.timeline = `M${m}-WK${rand < 10 ? `0${rand}` : rand}`
      }

      await Quarter.updateOne({ _id }, { services })
    }
  })
  res.end('finished randomizing')
}

module.exports = { getAll, getAllQuarters, getPresent, getQuarters, getYears, getServices, getByRole, 
                   addOneService, updateOneService, deleteOneService, 
                   updateServices, addServices, deleteServices,
                   randomizeServices }

// const getScoUsernames = services => [...new Set(services.map(s => s.sco_username))]
// const getServiceOwnerUsernames = services => [...new Set(services.map(s => s.service_owner_username))]

//----------------------------------
//        HELPER FUNCTIONS    
//----------------------------------

const addSCOs = async (services, fiscalStr) => {
  const retrievedSCOs = await SCO.find()
  const retrievedSCOsHas = {}
  retrievedSCOs.forEach((scoObj, i) => retrievedSCOsHas[scoObj.username] = i)
  const scosFromServices = getScosFromServices(services)
  
  for (const scoObj of scosFromServices) {
    const username = scoObj.username
    const index = retrievedSCOsHas[username]
    if (index===undefined) {
      await SCO.create({
        first_name : scoObj.first_name, 
        last_name  : scoObj.last_name , 
        username   : scoObj.username  ,
        password   : 'password'       ,
        access     : [fiscalStr]      ,
      })
    }
    else {
      if (!retrievedSCOs[index].access.includes(fiscalStr)) {
        const { _id } = retrievedSCOs[index]
        await SCO.updateOne({ _id }, { $push : { access : fiscalStr } })
      }
      else {
        console.log(`THIS SCO ALREADY HAS ACCESS TO ${fiscalStr}!`)
        console.log('By the way, this message should NEVER print')
      }
    }
  }
}

const addServiceOwners = async (services, fiscalStr) => {
  // const retrievedServiceOwners = await ServiceOwner.find()
  // const retrievedServiceOwnersHas = {}
  // retrievedServiceOwners.forEach((serviceOwnerObj, i) => retrievedServiceOwnersHas[serviceOwnerObj.username] = i)
  // const serviceOwnersFromServices = getServiceOwnersFromServices(services)

  // for (const serviceOwnerObj of serviceOwnersFromServices) {
  //   const username = serviceOwnerObj.username
  //   const index = retrievedServiceOwnersHas[username]
  //   if (index===undefined) {
  //     await ServiceOwner.create({
  //       first_name : serviceOwnerObj.first_name, 
  //       last_name  : serviceOwnerObj.last_name , 
  //       username   : serviceOwnerObj.username  ,
  //       password   : 'password'                ,
  //       access     : [fiscalStr]               ,
  //     })
  //   }
  //   else {
  //     if (!retrievedServiceOwners[index].access.includes(fiscalStr)) {
  //       const { _id } = retrievedServiceOwners[index]
  //       await ServiceOwner.updateOne({ _id }, { $push : { access : fiscalStr } })
  //     }
  //     else {
  //       console.log(`THIS SERVICE OWNER ALREADY HAS ACCESS TO ${fiscalStr}!`)
  //       console.log('By the way, this message should NEVER print')
  //     }
  //   }
  // }
}

const getScosFromServices = services => {
  let scos = []
  for (const service of services) {
    const { sco_first_name, sco_last_name, sco_username } = service
    scos.push({
      first_name : sco_first_name,
      last_name  : sco_last_name ,
      username   : sco_username  ,
    })
  }
  scos = _.uniqBy(scos, 'username')
  return scos
}

const getServiceOwnersFromServices = services => {
  let serviceOwners = []
  for (const service of services) {
    const { service_owner_first_name, service_owner_last_name, service_owner_username } = service
    // serviceOwners.push({
    //   first_name : service_owner_first_name,
    //   last_name  : service_owner_last_name ,
    //   username   : service_owner_username  ,
    // })
  }
  // serviceOwners = _.uniqBy(serviceOwners, 'username')
  // return serviceOwners
}

const getFiscalStr = (quarter, year) => `${year}_${quarter}`