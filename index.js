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
let compileState = false

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
		console.log(chalk.red('Copile Error'))
		console.log()
		console.log(err.stderr.toString())
		return false
	}
	return true
}

function prepareDir(dir) {
	try {
		fs.accessSync(dir)
		return true
	} catch (err) {
		if (err.code === 'ENOENT') {
			console.log(`Make dir directory "${dir}"`)
			executeCommand(`mkdir ${dir}`)
			return true
		}
		if (err.code === 'ENOTDIR') {
			console.error(chalk.red(`${dir} is not directory.`))
			return false
		}
	}
}

function prepareFile(path) {
	if (!fs.existsSync(path)) {
		console.log(`Make file "${path}"`)
		fs.writeFileSync(path, '')
		executeCommand(`touch ${path}`)
		return true
	} else if (fs.statSync(path).isDirectory()) {
		console.error(chalk.red(`${path} is not file.`))
		return false
	}
}

function runTestCase() {
	if (cases.length === 0) {
		console.log('no TestCases')
		return
	}
	if (!compileState) {
		console.log('Last Compile Failed')
		return
	}
	console.log(`---\nRunning Test (${cases.length} case)\n---\n`)
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
	compileState = executeCommand(`g++ ${targetFile} -o ${outputFile}`)
	runTestCase()
}

const testcaseListener = async (event, filename) => {
	console.log(`testcase updated: ${filename}`)
	cases = loadTestcase(testcaseFile)
	runTestCase()
}

function start() {
	if (!prepareDir(outputDir)) {
		return
	}
	if (!prepareFile(targetFile)) {
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

function init() {}

module.exports = (input, opts) => {
	if (opts.init) {
		init()
	} else {
		start()
	}
}
