import { expect } from 'chai'
import { Server, Client, Task } from '../src'
// import sinon from 'sinon'

describe('scheduler', () => {
  // let clock = null
  // beforeEach(function () {
  //   clock = sinon.useFakeTimers()
  // })
  it('return true', done => {
    // clock = sinon.useFakeTimers()
    const redisOption = {
        port: 26379,
        host: 'localhost'
    }
    const task = new Task({name: 'getPokemons', url: 'http://localhost:3000/pokemons', method: 'get', time: '* * * * *'})
    const server = new Server(redisOption)
    const client = new Client(redisOption)
    client.subscribe(task.name)
    client.on('message', (message) => {
      expect(message).to.be.a('string')
      done()
    })
    server.addTask(task.name, task)
      .then(res => {
        console.log('success add task')
      })
      // TODO: sinon faketitmes method do not invoke system crontab task
    // clock.tick(60 * 1000)
  })
  // afterEach(() => {
  //   clock.restore()
  // })
})
