// const Redis = require('ioredis')
// const redis = new Redis()

// redis.subscribe('demo', (err) => {
//   if (err) console.log('err')
// })

// redis.on('message', (channel, message) => {
//   console.log('Receive message %s from channel %s', message, channel)
// })

const { Client } = require('../src')

const client = new Client()
client.subscribe('demo')
client.on('message', (message) => {
  console.log('message', message)
})
