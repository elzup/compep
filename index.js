'use strict'
const fs = require('fs')
const { execSync } = require('child_process')
const chalk = require('chalk')
const _ = require('lodash')

const targetFile = 'main.cpp'
const outputDir = 'out/'
const outputFile = `${outputDir}main.out`
const testcaseDir = 'testcase/'
const testcaseFile = `${testcaseDir}main.testcase.txt`

const caseDelimiter = '\n====\n'
const ioDelimiter = '\n----\n'

let cases = []

function loadTestcase(file) {
	const data = fs.readFileSync(file, 'utf-8')
	const caseTexts = data.split(caseDelimiter)
	const cases = _.map(caseTexts, caseText => {
		const [input, expect] = _.map(caseText.split(ioDelimiter), v => v.trim())
		return { input, expect }
	})
	return cases
}

function executeCommand(command) {
	console.log(chalk.gray(`$ ${command}`))
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
			console.error(chalk.red(`${outputFile} is not directory.`))
			return false
		}
	}
}

const compileListener = async (event, filename) => {
	console.log(`target changed: ${filename}`)
	executeCommand(`g++ ${targetFile} -o ${outputFile}`)
}

const testcaseListener = async (event, filename) => {
	console.log(`testcase updated: ${filename}`)
	cases = loadTestcase(testcaseFile)
}

module.exports = (input, opts) => {
	if (!prepareOutputDir(outputDir)) {
		return
	}

	console.log(`compep watch start "${targetFile}" -> "${outputFile}"`)

	executeCommand(`g++ ${targetFile} -o ${outputFile}`)
	cases = loadTestcase(testcaseFile)
	fs.watch(targetFile, compileListener)
	fs.watch(testcaseFile, testcaseListener)
}
