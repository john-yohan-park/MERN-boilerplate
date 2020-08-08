const USERNAME = 'atlasAdmin'
const PASSWORD = 'ilovemongo'
const DB_NAME  = 'sox' 

const MONGO_KEY = `mongodb+srv://${USERNAME}:${PASSWORD}@soxcluster-dojkn.gcp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`

const SECRET = 'SECRET'

module.exports = { MONGO_KEY, SECRET }