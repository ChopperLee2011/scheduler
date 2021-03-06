const path = require('path')
const util = require('util')
const { spawnSync } = require('child_process')
const load = util.promisify(require('crontab').load)
const Redis = require('ioredis')
const EventEmitter = require('events').EventEmitter
const debug = require('debug')('scheduler')

const Task = require('./Task')
const CHANNEL = 'SCHEDULER'

class Server {
  constructor(opts){
    this.connection = opts
  }
  addTask (taskName, task) {
    debug('addTask taskName: %s task: %o', taskName, task)
    return new Promise((resolve, reject) => {
      const {stdout} = spawnSync('which', ['node'])
      const command = stdout.toString().replace(/\n$/, '')
      load()
        .then(cron => {
          const filePath = path.join(__dirname, 'executor.js')
          const message = JSON.stringify(task)
          cron.create(`${command} ${filePath} -n '${task.name}' -m '${message}' -s '${JSON.stringify(this.connection)}'`, task.time)
          cron.save()
          return resolve(null)
        })
    })
  }
}

class Client extends EventEmitter {
  constructor (opts) {
    super()
    this._redis = new Redis(opts)
    this.channel = []
  }
  subscribe (taskName) {
    debug('subscribe taskName: %s', taskName)
    this._redis.subscribe(CHANNEL, (err) => {
      if (err) {
        console.log('subscribe err: %o', err)
        throw err
      }
    })
    this._redis.on('message', (chl, msg) => {
      debug('redis channel: %s \t message: %s', chl, msg)
      if (chl === CHANNEL) {
        this.emit('message', msg)
      }
    })
  }

  start () {
    debug('start')
    this.on('message', msg => {
      debug('get message: %s', msg)
      const task = new Task(JSON.parse(msg))
      task.run()
    })
  }
}

export default { Server, Client, Task }
module.exports = exports.default
