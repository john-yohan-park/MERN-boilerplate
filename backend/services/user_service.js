const jwt    = require('jsonwebtoken')
const SECRET = 'secret'

async function authenticate(username, password, users) {
  // console.log('called backend > services > user_service > authenticate')
  const user = users.find(u => u.sco_username === username && u.sco_password === password)
  if (user) {
    const { password, ...userWithoutPassword } = user
    const token = jwt.sign({ sub: user.id }, SECRET)
    return { ...userWithoutPassword , token }
  }
}

module.exports = { authenticate }