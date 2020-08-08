const mongoose        = require('mongoose')
const Schema          = mongoose.Schema
const COLLECTION_NAME = 'sco'

const SCOSchema = new Schema ({
  first_name : String, 
  last_name  : String, 
  username   : String,
  password   : String,
  access     : [String],
})

module.exports = mongoose.model('SCOSchema', SCOSchema, COLLECTION_NAME)