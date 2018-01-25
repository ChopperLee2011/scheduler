class Task {
  constructor (opt = {}) {
    this.url = opt.url
    this.method = opt.method.toLowerCase()
    this.message = opt.message
    this.time = opt.time
    this.name = opt.name.toLowerCase()
  }
}

module.exports = Task
