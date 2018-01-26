const Redis = require('ioredis')
const redis = new Redis({ host: 'localhost', port: 26379 })

redis.subscribe('SCHEDULER', (err) => {
  if (err) console.log('err')
})

redis.on('message', (channel, message) => {
  console.log('Receive message %s from channel %s', message, channel)
})
