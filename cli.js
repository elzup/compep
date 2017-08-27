#!/usr/bin/env node
'use strict'
const meow = require('meow')
const compep = require('.')

// TODO
const cli = meow(`
	Usage
	  $ compep

	Options:
		--init Generate workspace
`)

compep(cli.input[0], cli.flags)
