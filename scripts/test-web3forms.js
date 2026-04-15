// Test script for Web3Forms (no deps)
// Usage: set WEB3FORMS_KEY=<your_key> && node scripts/test-web3forms.js

const https = require('https')
const { URLSearchParams } = require('url')

const ACCESS_KEY = process.env.WEB3FORMS_KEY || 'f6bd07d8-4af1-473b-a5cb-106b67a9cb67'

const params = new URLSearchParams({
  access_key: ACCESS_KEY,
  subject: 'Node test',
  from_name: 'NodeTest',
  replyto: 'test@example.com',
  message: 'Hello from node test script'
}).toString()

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(params),
    'User-Agent': 'Node.js Web3Forms Test'
  }
}

const req = https.request('https://api.web3forms.com/submit', options, (res) => {
  let data = ''
  res.on('data', (chunk) => { data += chunk })
  res.on('end', () => {
    console.log('statusCode=', res.statusCode)
    console.log('headers=', res.headers)
    console.log('body=', data)
  })
})

req.on('error', (err) => {
  console.error('request error', err)
})

req.write(params)
req.end()
