const program = require('commander')
const Redis = require('ioredis')

const CHANNEL = 'SCHEDULER'

// TODO:program.name can be used to distinguish tasks later.
program
  .option('-m message <message>', '')
  .option('-n name <name>')
  .option('-s connection <connection>')
  .action(() => {
    console.log('name: %s', program.name)
    console.log('message: %s', program.message)
    console.log('redis connection: %s', program.connection)
  })
  .parse(process.argv)

if (program.message) {
  console.log('program.connection', program.connection)
  const pub = new Redis(JSON.parse(program.connection))
  pub.publish(CHANNEL, program.message)
}
