const fs = require('fs');
const path = require('path');

const isDirWithIndexFile = function (dir) {
  if (!fs.lstatSync(dir).isDirectory()) { return false; }
  return fs.existsSync(path.join(dir, 'index.js')) || fs.existsSync(path.join(dir, 'index.coffee'));
};

module.exports = function (dir, mod, ...ignoreModules) {
  let target;

  if (mod && mod instanceof module.constructor) {
    mod.exports = mod.exports || {};
    target = mod.exports;
  } else {
    if (mod) { ignoreModules.push(mod); }
    target = {};
  }

  // resolve names of modules in the directory
  let moduleNames = fs
    .readdirSync(dir)
    .filter(function (f) {
      const ext = path.extname(f);
      return ext === '.js' || ext === '.coffee' || isDirWithIndexFile(path.join(dir, f));
    });

  moduleNames = moduleNames.map(moduleName => path.basename(path.basename(moduleName, '.js'), '.coffee'));

  // ignore specified files and the index file
  if (!(ignoreModules.includes('index'))) {
    ignoreModules.push('index');
  }

  for (const file of ignoreModules) {
    const fileIndex = moduleNames.indexOf(file);
    if (fileIndex >= 0) {
      moduleNames.splice(fileIndex, 1);
    }
  }

  // export each module
  for (const name of moduleNames) {
    target[name] = require(path.resolve(dir, name));
  }

  return target;
};
