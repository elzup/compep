'use strict'
const fs = require('fs')
const { execSync } = require('child_process')
const chalk = require('chalk')
const _ = require('lodash')
const jsdiff = require('diff')

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
		const [input, expect] = _.map(
			caseText.split(ioDelimiter),
			v => v.trim() + '\n'
		)
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

function runTestCase() {
	if (cases.length === 0) {
		console.log('no TestCases')
		return
	}
	console.log(`run ${cases.length} test`)
	_.each(cases, (testCase, i) => {
		const res = execSync(`./${outputFile}`, { input: testCase.input })
		const ans = res.toString('utf8')
		if (testCase.expect === ans) {
			console.log(`  case ${i} ` + chalk.green('OK'))
		} else {
			console.log(`  case ${i} ` + chalk.red('NG'))
			console.log(' expect:')
			console.log(testCase.expect)
			console.log(' received:')
			console.log(chalk.red(ans))
		}
	})
}

const compileListener = async (event, filename) => {
	console.log(`target changed: ${filename}`)
	executeCommand(`g++ ${targetFile} -o ${outputFile}`)
	runTestCase()
}

const testcaseListener = async (event, filename) => {
	console.log(`testcase updated: ${filename}`)
	cases = loadTestcase(testcaseFile)
	runTestCase()
}

module.exports = (input, opts) => {
	if (!prepareOutputDir(outputDir)) {
		return
	}

	console.log(`compep watch start "${targetFile}" -> "${outputFile}"`)

	executeCommand(`g++ ${targetFile} -o ${outputFile}`)
	fs.watch(targetFile, compileListener)
	if (fs.existsSync(testcaseFile)) {
		cases = loadTestcase(testcaseFile)
		fs.watch(testcaseFile, testcaseListener)
	} else {
		console.log(`no testcase file ${testcaseFile}`)
	}
}
