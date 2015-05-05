fs = require('fs')
path = require('path')


module.exports = (dir, mod, ignoreModules...) ->

  target =
    if mod?.constructor?.name == 'Module'
      mod.exports ?= {}
      mod.exports
    else
      ignoreModules.push(mod) if mod?
      {}

  # resolve names of modules in the directory
  moduleNames = fs.readdirSync(dir).map (f) ->
    path.basename(path.basename(f, '.js'), '.coffee')

  # ignore specified files and the index file
  unless ignoreModules.indexOf('index') >= 0
    ignoreModules.push 'index'

  for file in ignoreModules
    fileIndex = moduleNames.indexOf(file)
    if fileIndex >= 0
      moduleNames.splice(fileIndex, 1)

  # export each module
  for name in moduleNames
    target[name] = require(path.resolve(dir, name))

  target
