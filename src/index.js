/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const fs = require('fs');
const path = require('path');

const isDirWithIndexFile = function(dir) {
  if (!fs.lstatSync(dir).isDirectory()) { return false; }
  return fs.existsSync(path.join(dir, 'index.js')) || fs.existsSync(path.join(dir, 'index.coffee'));
};

module.exports = function(dir, mod, ...ignoreModules) {

  const target =
    (() => {
    if (__guard__(mod != null ? mod.constructor : undefined, x => x.name) === 'Module') {
      if (mod.exports == null) { mod.exports = {}; }
      return mod.exports;
    } else {
      if (mod != null) { ignoreModules.push(mod); }
      return {};
    }
  })();

  // resolve names of modules in the directory
  let moduleNames = fs.readdirSync(dir).filter(function(f) {
    const ext = path.extname(f);
    return (ext === '.js') || (ext === '.coffee') || isDirWithIndexFile(path.join(dir, f));
  });

  moduleNames = moduleNames.map(moduleName => path.basename(path.basename(moduleName, '.js'), '.coffee'));

  // ignore specified files and the index file
  if (!(ignoreModules.indexOf('index') >= 0)) {
    ignoreModules.push('index');
  }

  for (let file of Array.from(ignoreModules)) {
    const fileIndex = moduleNames.indexOf(file);
    if (fileIndex >= 0) {
      moduleNames.splice(fileIndex, 1);
    }
  }

  // export each module
  for (let name of Array.from(moduleNames)) {
    target[name] = require(path.resolve(dir, name));
  }

  return target;
};

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}