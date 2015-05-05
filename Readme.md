## Indexer

This Node.JS module requires a directory of JavaScript (or CoffeeScript) files and makes the associated modules available.
It can be used to extend a specified module.

[![Build Status](https://travis-ci.org/activeprospect/indexer.svg)](https://travis-ci.org/activeprospect/indexer)


### Usage

Assume the following directory structure:

```
zoo
|-- ape.js
|-- donkey.js
|-- zebra.js
```

Add an index file (`zoo/index.js`) which delegates to the indexer module:

```javascript
var path = require('path');

var index = require('indexer');

// index all the files in the same directory and extend this module
index(__dirname, module);
```

Then to use the `zoo` module:

```javascript
var zoo = require('zoo');

zoo.ape    // returns the module defined in zoo/ape.js
zoo.donkey // returns the module defined in zoo/donkey.js
zoo.zebra  // returns the module defined in zoo/zebra.js
```

### Reference

This module exports a single function with the following parameters:

 * `dirname` &mdash; the directory of files to index (.js and .coffee files will be indexed)
 * `module` &mdash; (optional) export each module in `dirname` to this module.
 * `ignoreModules` &mdash; the rest of the parameters passed to the function are module names to ignore
    (i.e. `index(__dirname, module 'ape', 'donkey')` will only export the `zebra` module)

The object returned by the function has a property for each module in the `dirname`.







