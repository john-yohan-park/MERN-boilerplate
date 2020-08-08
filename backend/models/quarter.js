const mongoose        = require('mongoose')
const Schema          = mongoose.Schema
const COLLECTION_NAME = 'quarter'

const ServiceSchema = new Schema ({
  service_owner_first_name : String, 
  service_owner_last_name  : String, 
  service_owner_username   : String,
  control_name             : String,
  control_type             : String,
  track                    : String,
  application_name         : String,
  narrative_link           : String,
  sco_first_name           : String,
  sco_last_name            : String,
  sco_username             : String,
  status                   : String,
  timeline                 : String,
  completed_month          : String,
})

const QuarterSchema = new Schema ({
  year     : String ,
  quarter  : String ,
  start    : Date   ,
  end      : Date   ,
  services : [ServiceSchema],
})

module.exports = mongoose.model('QuarterSchema', QuarterSchema, COLLECTION_NAME)