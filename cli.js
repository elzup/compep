#!/usr/bin/env node
'use strict'
const meow = require('meow')
const compep = require('.')

// TODO
const cli = meow(`
	Usage
	  $ compep <command>

	Commands:
		- start
		- init

	Examples
	  $ compep [start]
	  start compep watch
	  $ compep init
	  generate workspace
`)

compep(cli.input[0] || 'start')
