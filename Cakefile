{spawn, exec} = require 'child_process'
require 'coffee-script/register'
fs = require 'fs'
path = require 'path'

task 'build', ->
  coffeePath = './node_modules/coffee-script/bin/coffee'
  if fs.existsSync(coffeePath)
    run "rm -rf ./lib; #{coffeePath} -o lib -c src"
  else
    console.log('> skipping build because coffee-script is not installed')
    process.exit 1

task 'test', ->
  path = "spec/*-spec.coffee"
  run "./node_modules/.bin/mocha #{path} --recursive --compilers coffee:coffee-script/register --reporter spec --colors"

run = (command) ->
  cmd = spawn '/bin/sh', ['-c', command]
  cmd.stdout.on 'data', (data) ->
    process.stdout.write data
  cmd.stderr.on 'data', (data) ->
    process.stderr.write data
  process.on 'SIGHUP', ->
    cmd.kill()
  cmd.on 'exit', (code) ->
    process.exit(code)