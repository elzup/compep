#!/usr/bin/env node
'use strict'
const meow = require('meow')
const compep = require('.')

// TODO
const cli = meow(`
	Usage
	  $ compep [input]

	Options
	  --foo  Lorem ipsum [Default: false]

	Examples
	  $ compep
	  unicorns & rainbows
	  $ compep ponies
	  ponies & rainbows
`)

console.log(compep(cli.input[0] || 'unicorns'))
