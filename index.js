'use strict'
const fs = require('fs')
const { execSync } = require('child_process')

const targetFile = 'main.cpp'
const outputFile = 'out/main.out'

module.exports = (input, opts) => {
	console.log(`compep watch start "${targetFile}" -> "${outputFile}"`)
	fs.watch(targetFile, async (event, filename) => {
		console.log(`changed: ${filename}`)
		try {
			execSync(`g++ ${targetFile} -o ${outputFile}`)
		} catch (err) {
			console.log('error')
			console.log({
				ls_stdout: err.stdout.toString(),
				ls_stderr: err.stderr.toString(),
			})
		}
	})
}
