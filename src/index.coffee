fs = require('fs')
path = require('path')

isDirWithIndexFile = (dir) ->
  return false unless fs.lstatSync(dir).isDirectory()
  fs.existsSync(path.join(dir, 'index.js')) or fs.existsSync(path.join(dir, 'index.coffee'))

module.exports = (dir, mod, ignoreModules...) ->

  target =
    if mod?.constructor?.name == 'Module'
      mod.exports ?= {}
      mod.exports
    else
      ignoreModules.push(mod) if mod?
      {}

  # resolve names of modules in the directory
  moduleNames = fs.readdirSync(dir).filter (f) ->
    ext = path.extname(f)
    ext == '.js' or ext == '.coffee' or isDirWithIndexFile(path.join(dir, f))

  moduleNames = moduleNames.map (moduleName) ->
    path.basename(path.basename(moduleName, '.js'), '.coffee')

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
