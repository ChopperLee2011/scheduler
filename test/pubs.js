const Redis = require('ioredis')
const pub = new Redis({ host: 'localhost', port: 26379 })

pub.publish('SCHEDULER', 'Hello world!');
