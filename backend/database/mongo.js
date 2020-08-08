const mongoose      = require('mongoose')
const { MONGO_KEY } = require('../config')

function connect() {
  const options = {
    useNewUrlParser    : true,
    useUnifiedTopology : true
  }
  mongoose.connect(MONGO_KEY, options, err => {
    err ?
      console.log('Failed to connect to Mongo!')
      : console.log('Connected to Mongo!')
  })
}// connect

function drop(collectionName) {
  mongoose.connection.db.dropCollection(collectionName, function(err, res) { })
}

module.exports = { connect, drop }