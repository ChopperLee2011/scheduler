import { expect } from 'chai'
import { Server, Client, Task } from '../src'
// import { useFakeTimers } from 'sinon'

// const { useFakeTimers } = require('sinon')
const sinon = require('sinon')

describe('scheduler', () => {
  let clock = null

  beforeEach(function () {
    clock = sinon.useFakeTimers();
  })
  it('return true', done => {
    clock = sinon.useFakeTimers()
    // console.log('useFakeTimers', useFakeTimers)
    const redisOption = {
      redis: {
        port: 6379,
        hos: 'localhost'
      }
    }
    const task = new Task({name: 'demo', url: 'http://localhost:3000/pokemon', method: 'post', time: '* * * * *'})
    const server = new Server(redisOption)
    const client = new Client(redisOption)
    client.subscribe(task.name)
    client.on('message', (message) => {
      console.log('message', message)
      expect(message).to.be.a('string')
      done()
    })
    // setTimeout(function(){done()}, 60000)
    server.addTask(task.name, task)
      .then(res => {
        console.log('success add task')
      })
    clock.tick(70 * 1000)
  })

  afterEach(() => {
    clock.restore()
  })
})
