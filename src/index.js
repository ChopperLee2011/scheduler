const path = require('path')
const util = require('util')
const { spawnSync } = require('child_process')
const load = util.promisify(require('crontab').load)
const Redis = require('ioredis')
const EventEmitter = require('events').EventEmitter
const debug = require('debug')('scheduler')

const Task = require('./Task')

class Server {
  addTask (taskName, task) {
    debug('addTask taskName: %s task: %o', taskName, task)
    return new Promise((resolve, reject) => {
      const {stdout} = spawnSync('which', ['node'])
      const command = stdout.toString().replace(/\n$/, '')
      load()
        .then(cron => {
          const filePath = path.join(__dirname, 'executor.js')
          const message = JSON.stringify(task)
          cron.create(`${command} ${filePath} -n '${task.name}' -m ${message}`, task.time)
          cron.save()
          return resolve(null)
        })
    })
  }
}

class Client extends EventEmitter {
  constructor (opt) {
    super()
    this._redis = new Redis()
  }
  subscribe (taskName) {
    debug('subscribe taskName: %s', taskName)
    this._redis.subscribe(taskName, (err) => {
      if (err) {
        console.log('subscribe err: %o', err)
        throw err
      }
    })
    this._redis.on('message', msg => {
       console.log('redis on message', msg)
       this.emit('message', msg)
     })
  }
}

// module.exports = { Client }
export default { Server, Client, Task }
module.exports = exports.default
