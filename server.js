const fs = require('fs')
const https = require('https')

const app = require('./app')
const server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert:fs.readFileSync('cert.pem')
},app)
const port = 3000

server.listen(port, () => console.log(`Example app listening on port ${port}!`))