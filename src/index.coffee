fs = require('fs')
path = require('path')


module.exports = (dir, mod) ->

  # resolve names of modules in the directory
  moduleNames = fs.readdirSync(dir).map (f) ->
    path.basename(path.basename(f, '.js'), '.coffee')

  # ignore the index file
  if moduleNames.indexOf('index') >= 0
    moduleNames.splice(moduleNames.indexOf('index'), 1)

  # export each module
  mod.exports ?= {}

  for name in moduleNames
    mod.exports[name] = require(path.resolve(dir, name))

  moduleNames
