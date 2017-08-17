'use strict'
const fs = require('fs')
const { execSync } = require('child_process')
require('colors')

const targetFile = 'main.cpp'
const outputFile = 'out/main.out'

module.exports = (input, opts) => {
	console.log(`compep watch start "${targetFile}" -> "${outputFile}"`)
	fs.watch(targetFile, async (event, filename) => {
		console.log(`changed: ${filename}`)
		try {
			const command = `g++ ${targetFile} -o ${outputFile}`
			console.log(`$ ${command}`.gray)
			execSync(command)
		} catch (err) {
			console.log('error')
			console.log({
				ls_stdout: err.stdout.toString(),
				ls_stderr: err.stderr.toString(),
			})
		}
	})
}
