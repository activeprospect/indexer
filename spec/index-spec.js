assert = require('chai').assert
Module = require('module')
fs = require('fs')
path = require('path')
index = require('../src/index')


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


describe 'Index', ->

  describe 'to module', ->

    it 'should export modules by file name', ->
      index(path.join(__dirname, 'module'), mod)
      assert.equal mod.exports.one, 'one'
      assert.equal mod.exports.two, 'two'


    it 'should return exports', ->
      indexed = index(modulePath, mod)
      keys = Object.keys(indexed)
      assert.deepEqual keys, ['one', 'two']
      assert.equal indexed.one, require('./module/one')
      assert.equal indexed.two, require('./module/two')


    it 'should ignore index file', ->
      fs.writeFileSync(indexFile, 'module.exports = "index"')
      assert.deepEqual Object.keys(index(modulePath, mod)), ['one', 'two']


    it 'should ignore non-script file', ->
      fs.writeFileSync(path.join(modulePath, 'docs.md'), '## My Docs')
      assert.deepEqual Object.keys(index(modulePath, mod)), ['one', 'two']


    it 'should support javascript', ->
      fs.writeFileSync(path.join(modulePath, 'three.js'), 'module.exports = "index";')
      assert.deepEqual Object.keys(index(modulePath, mod)), ['one', 'three', 'two']


    it 'should ignore file', ->
      assert.deepEqual Object.keys(index(modulePath, mod, 'one')), ['two']


    it 'should ignore multiple files', ->
      assert.deepEqual Object.keys(index(modulePath, mod, 'one', 'two')), []



  describe 'without module', ->


    it 'should return exports', ->
      indexed = index(modulePath)
      keys = Object.keys(indexed)
      assert.deepEqual keys, ['one', 'two']
      assert.equal indexed.one, require('./module/one')
      assert.equal indexed.two, require('./module/two')


    it 'should ignore index file', ->
      fs.writeFileSync(indexFile, 'module.exports = "index"')
      assert.deepEqual Object.keys(index(modulePath)), ['one', 'two']


    it 'should ignore non-script file', ->
      fs.writeFileSync(path.join(modulePath, 'docs.md'), '## My Docs')
      assert.deepEqual Object.keys(index(modulePath, mod)), ['one', 'two']


    it 'should support javascript', ->
      fs.writeFileSync(path.join(modulePath, 'three.js'), 'module.exports = "index";')
      assert.deepEqual Object.keys(index(modulePath)), ['one', 'three', 'two']


    it 'should ignore file', ->
      assert.deepEqual Object.keys(index(modulePath, 'one')), ['two']


    it 'should ignore multiple files', ->
      assert.deepEqual Object.keys(index(modulePath, 'one', 'two')), []
