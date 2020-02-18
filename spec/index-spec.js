/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  assert
} = require('chai');
const Module = require('module');
const fs = require('fs');
const path = require('path');
const index = require('../src/index');


let mod = null;
let modulePath = null;
let indexFile = null;

beforeEach(function() {
  mod = new Module('test', module);
  modulePath = path.join(__dirname, 'module');
  return indexFile = path.join(modulePath, 'index.coffee');
});

afterEach(() => (() => {
  const result = [];
  for (let f of Array.from(fs.readdirSync(modulePath))) {
    if (!f.match(/(one|two).coffee/)) { result.push(fs.unlinkSync(path.join(modulePath, f))); } else {
      result.push(undefined);
    }
  }
  return result;
})());


describe('Index', function() {

  describe('to module', function() {

    it('should export modules by file name', function() {
      index(path.join(__dirname, 'module'), mod);
      assert.equal(mod.exports.one, 'one');
      return assert.equal(mod.exports.two, 'two');
    });


    it('should return exports', function() {
      const indexed = index(modulePath, mod);
      const keys = Object.keys(indexed);
      assert.deepEqual(keys, ['one', 'two']);
      assert.equal(indexed.one, require('./module/one'));
      return assert.equal(indexed.two, require('./module/two'));
    });


    it('should ignore index file', function() {
      fs.writeFileSync(indexFile, 'module.exports = "index"');
      return assert.deepEqual(Object.keys(index(modulePath, mod)), ['one', 'two']);
  });


    it('should ignore non-script file', function() {
      fs.writeFileSync(path.join(modulePath, 'docs.md'), '## My Docs');
      return assert.deepEqual(Object.keys(index(modulePath, mod)), ['one', 'two']);
  });


    it('should support javascript', function() {
      fs.writeFileSync(path.join(modulePath, 'three.js'), 'module.exports = "index";');
      return assert.deepEqual(Object.keys(index(modulePath, mod)), ['one', 'three', 'two']);
  });


    it('should ignore file', () => assert.deepEqual(Object.keys(index(modulePath, mod, 'one')), ['two']));


    return it('should ignore multiple files', () => assert.deepEqual(Object.keys(index(modulePath, mod, 'one', 'two')), []));
});



  return describe('without module', function() {


    it('should return exports', function() {
      const indexed = index(modulePath);
      const keys = Object.keys(indexed);
      assert.deepEqual(keys, ['one', 'two']);
      assert.equal(indexed.one, require('./module/one'));
      return assert.equal(indexed.two, require('./module/two'));
    });


    it('should ignore index file', function() {
      fs.writeFileSync(indexFile, 'module.exports = "index"');
      return assert.deepEqual(Object.keys(index(modulePath)), ['one', 'two']);
  });


    it('should ignore non-script file', function() {
      fs.writeFileSync(path.join(modulePath, 'docs.md'), '## My Docs');
      return assert.deepEqual(Object.keys(index(modulePath, mod)), ['one', 'two']);
  });


    it('should support javascript', function() {
      fs.writeFileSync(path.join(modulePath, 'three.js'), 'module.exports = "index";');
      return assert.deepEqual(Object.keys(index(modulePath)), ['one', 'three', 'two']);
  });


    it('should ignore file', () => assert.deepEqual(Object.keys(index(modulePath, 'one')), ['two']));


    return it('should ignore multiple files', () => assert.deepEqual(Object.keys(index(modulePath, 'one', 'two')), []));
});
});
