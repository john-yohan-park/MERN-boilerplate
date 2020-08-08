const ServiceOwner = require('../models/service_owner')
const SCO          = require('../models/sco')
const Admin        = require('../models/admin')

// GET
// localhost:8080/api/employees/service_owners
async function getServiceOwners(req, res) {
  res.send(await ServiceOwner.find())
}

// GET
// localhost:8080/api/employees/scos
async function getSCOs(req, res) {
  res.send(await SCO.find())
}

async function getAdmins(req, res) {
  const admins = await Admin.find()
  res.send(admins)
}

async function deleteUserByRole(req, res) {
  const { role, user : { _id, first_name, last_name, username, password } } = req.body
  switch (role) {
    case 'admin': 
      await Admin.deleteOne({ _id })
      break
    case 'service owner':
      await ServiceOwner.deleteOne({ _id })
      break
    case 'sco':
      await SCO.deleteOne({ _id })
      break
    default:
  }
  res.send('deleted user!')
}

async function addUserByRole(req, res) {
  const { role, user } = req.body
  switch (role) {
    case 'admin':
      await Admin.create(user)
      break
    case 'service owner':
      await ServiceOwner.create(user)
      break
    case 'sco':
      await SCO.create(user)   
      break
    default:
  }
  res.send('added user!')
}

module.exports = { getServiceOwners, getSCOs, getAdmins, deleteUserByRole, addUserByRole }