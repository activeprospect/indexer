## Indexer

This Node.JS module exports a directory of JavaScript (or CoffeeScript) files as a module. This is useful when you have
a directory of sources files and you want each source file to be exposed as a module.

[![Build Status](https://travis-ci.org/activeprospect/indexer.svg)](https://travis-ci.org/activeprospect/indexer)

### Setup


Assume the following directory structure and that you want to be able to `require('zoo').ape`.

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
index(__dirname, module);
```

To exclude certain files from being indexed:

```javascript
var path = require('path');

var index = require('indexer');

// exclude ape and donkey
index(__dirname, module, 'ape', 'donkey');
// => ['zebra']
```


### Usage

Assuming the above setup, to use the `zoo` module:

```javascript
var zoo = require('zoo');

zoo.ape    // returns the module defined in zoo/ape.js
zoo.donkey // returns the module defined in zoo/donkey.js
zoo.zebra  // returns the module defined in zoo/zebra.js
```



