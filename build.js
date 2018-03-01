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

var buildCommand = './node_modules/.bin/webpack'
if (yargs.endpoint) {
  buildCommand = buildCommand + ' --endpoint ' + yargs.endpoint
}
if (yargs.piwik) {
  buildCommand = buildCommand + ' --piwik ' + yargs.piwik
}
if (yargs.piwik_instance) {
  buildCommand = buildCommand + ' --piwik_instance ' + yargs.piwik_instance
}
if (yargs.google_api_key) {
  buildCommand = buildCommand + ' --google_api_key ' + yargs.google_api_key
}
if (yargs.raap_api_key) {
  buildCommand = buildCommand + ' --raap_api_key ' + yargs.raap_api_key
}
if (yargs.raap_instance) {
  buildCommand = buildCommand + ' --raap_instance ' + yargs.raap_instance
}
commands.push(buildCommand)

isGitClean().then(function (clean) {
  if (clean || yargs.f) {
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
    console.log('ERROR: Unable to build because git state not clean. Commit or stash your changes, or use --f to force a build (dev only).')
  }
})
