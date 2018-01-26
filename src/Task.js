import axios from 'axios'

class Task {
  constructor (opt = {}) {
    this.url = opt.url
    this.method = opt.method.toLowerCase()
    this.data = opt.data
    this.time = opt.time
    this.name = opt.name.toLowerCase()
  }
  run () {
    return axios[this.method](this.url)
  }
}

module.exports = Task
