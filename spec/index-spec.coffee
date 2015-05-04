assert = require('chai').assert
Module = require('module')
fs = require('fs')
path = require('path')
indexer = require('../src/index')

mod = null
modulePath = null
indexFile = null

beforeEach ->
  mod = new Module('test', module)
  modulePath = path.join(__dirname, 'module')
  indexFile = path.join(modulePath, 'index.coffee')

afterEach ->
  for f in fs.readdirSync(modulePath)
    fs.unlinkSync(path.join(modulePath, f)) unless f.match(/(one|two).coffee/)


it 'should export modules by file name', ->
  indexer(path.join(__dirname, 'module'), mod)
  assert.equal mod.exports.one, 'one'
  assert.equal mod.exports.two, 'two'

it 'should return module names', ->
  assert.deepEqual indexer(modulePath, mod), ['one', 'two']

it 'should ignore index file', ->
  fs.writeFileSync(indexFile, 'module.exports = "index"')
  assert.deepEqual indexer(modulePath, mod), ['one', 'two']

it 'should support javascript', ->
  fs.writeFileSync(path.join(modulePath, 'three.js'), 'module.exports = "index";')
  assert.deepEqual indexer(modulePath, mod), ['one', 'three', 'two']