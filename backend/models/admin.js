const mongoose        = require('mongoose')
const Schema          = mongoose.Schema
const COLLECTION_NAME = 'admin'

const AdminSchema = new Schema ({
  first_name : String, 
  last_name  : String, 
  username   : String,
  password   : String,
})

module.exports = mongoose.model('AdminSchema', AdminSchema, COLLECTION_NAME)