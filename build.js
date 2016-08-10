const exec = require('child_process').exec
const isGitClean = require('is-git-clean')
const yargs = require('yargs').argv
const execPromise = function (cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, function (err, stdout) {
      if (err) return reject(err)
      resolve(stdout)
    })
  })
}

var commands = [
  'rm -rf ./dist',
  'mkdir -p ./dist',
  'git rev-parse --short HEAD > ./dist/VERSION.txt'
]

var buildCommand = './node_modules/.bin/webpack --optimize-minimize --optimize-dedupe'
if (yargs.endpoint) {
  buildCommand = buildCommand + ' --endpoint ' + yargs.endpoint
}
commands.push(buildCommand)

isGitClean().then(function (clean) {
  if (clean) {
    console.log('Kicking off webpack build.')

    commands.reduce(function (promise, cmd) {
      return promise.then(function (results) {
        return execPromise(cmd).then(function (stdout) {
          results.push(stdout)
          return results
        })
      })
    },
    Promise.resolve([])).then(function (results) {
      results.forEach(function (result) {
        console.log(result)
      })
    },
    function (err) {
      console.log(err)
    })
  } else {
    console.log('ERROR: Unable to build because git state not clean. Commit or stash your changes.')
  }
})
