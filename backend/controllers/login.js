const jwt          = require('jsonwebtoken')
const { SECRET }   = require('../config')
const SCO          = require('../models/sco')
const ServiceOwner = require('../models/service_owner')
const Admin        = require('../models/admin')

// POST
// localhost:8080/api/login/authenticate
async function authenticate(req, res) {
  const { username, password, role } = req.body
  let user
  switch (role) {
    case 'admin':
      user = await Admin.findOne({ username, password })
      break
    case 'service owner':
      user = await ServiceOwner.findOne({ username, password })
      break
    case 'sco':
      user = await SCO.findOne({ username, password })
      break
    default:
  }
  let msg = 'Invalid login'
  if (user) {
    msg = 'Login success'
    const { first_name, last_name, username } = user
    const token = jwt.sign({ sub: user.id }, SECRET)
    res.send({ msg, token, first_name, last_name, username, role })
  }
  else {
    res.send({msg})
  }
}

// PUT
// localhost:8080/api/login/update_password
async function updatePassword(req, res) {
  const { username, oldPassword, newPassword, role } = req.body

  const query = { username, password : oldPassword }
  
  let user
  switch (role) {
    case 'admin':
      user = await Admin.findOne(query)
      break
    case 'service owner':
      user = await ServiceOwner.findOne(query)
      break
    case 'sco':
      user = await SCO.findOne(query)
      break
    default:
  }
  let msg = 'Current password is incorrect'
  if (user) {
    switch (role) {
      case 'admin':
        await Admin.updateOne(query, { password : newPassword })
        break
      case 'service owner':
        await ServiceOwner.updateOne(query, { password : newPassword })
        break
      case 'sco':
        await SCO.updateOne(query, { password : newPassword })
        break
      default:
    }
    msg = 'Password has been updated'
  }
  res.send({msg})
}

module.exports = { authenticate, updatePassword }