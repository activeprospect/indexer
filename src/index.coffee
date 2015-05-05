fs = require('fs')
path = require('path')


module.exports = (dir, mod, ignoreFiles...) ->

  # resolve names of modules in the directory
  moduleNames = fs.readdirSync(dir).map (f) ->
    path.basename(path.basename(f, '.js'), '.coffee')

  # ignore specified files and the index file
  unless ignoreFiles.indexOf('index') >= 0
    ignoreFiles.push 'index'

  for file in ignoreFiles
    fileIndex = moduleNames.indexOf(file)
    if fileIndex >= 0
      moduleNames.splice(fileIndex, 1)

  # export each module
  mod.exports ?= {}

  for name in moduleNames
    mod.exports[name] = require(path.resolve(dir, name))

  moduleNames
