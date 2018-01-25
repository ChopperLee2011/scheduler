const program = require('commander')
const Redis = require('ioredis')
const pub = new Redis()

program
  .option('-m message <message>', '')
  .option('-n name <name')
  .action(() => {
    console.log('name: %s', program.name)
    console.log('message: %s', program.message)
  })
  .parse(process.argv)

if (program.message) {
  pub.publish(program.name, program.message)
}
