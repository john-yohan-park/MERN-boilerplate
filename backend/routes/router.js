module.exports = app => {
  // const uploadDataRoutes  = require('../controllers/upload')
  // const employeeRoutes    = require('./employee')
  const quarterRoutes     = require('./quarter')
  // const loginRoutes       = require('./login')
  // const emailRoutes       = require('./email')
  // app.use('/api/upload'   , uploadDataRoutes)
  // app.use('/api/employees', employeeRoutes)
  app.use('/api/quarters' , quarterRoutes)
  // app.use('/api/login'    , loginRoutes)
  // app.use('/api/email'    , emailRoutes)
}
