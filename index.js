'use strict'
const fs = require('fs')
const { execSync } = require('child_process')
require('colors')

const targetFile = 'main.cpp'
const outputDir = 'out/'
const outputFile = `${outputDir}main.out`

module.exports = (input, opts) => {
	function executeCommand(command) {
		console.log(`$ ${command}`.gray)
		try {
			execSync(command)
		} catch (err) {
			console.log('error')
			console.log({
				ls_stdout: err.stdout.toString(),
				ls_stderr: err.stderr.toString(),
			})
		}
	}

	function prepareOutputDir(outputDir) {
		try {
			fs.accessSync(outputDir)
			return true
		} catch (err) {
			if (err.code === 'ENOENT') {
				console.log(`Make output directory "${outputDir}"`)
				executeCommand(`mkdir ${outputDir}`)
				return true
			}
			if (err.code === 'ENOTDIR') {
				console.error(`${outputFile} is not directory.`.red)
				return false
			}
		}
	}
	if (!prepareOutputDir(outputDir)) {
		return
	}

	console.log(`compep watch start "${targetFile}" -> "${outputFile}"`)
	fs.watch(targetFile, async (event, filename) => {
		console.log(`changed: ${filename}`)
		executeCommand(`g++ ${targetFile} -o ${outputFile}`)
	})
}
