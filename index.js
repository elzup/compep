'use strict'
const fs = require('fs')
const { execSync } = require('child_process')
const chalk = require('chalk')
const _ = require('lodash')
const sleep = require('sleep-promise')

const targetFile = 'main.cpp'
const outputDir = 'out/'
const outputFile = `${outputDir}main.out`
const testcaseDir = 'testcase/'
const testcaseFile = `${testcaseDir}main.testcase.txt`

const templateDir = __dirname + '/template/'
const templateTargetFile = `${templateDir}${targetFile}`
const templateTestcaseFile = `${templateDir}${testcaseFile}`

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
		console.log(chalk.red('Copile error.'))
		console.log(chalk.gray('>'))
		console.log(err.stderr.toString())
		console.log(chalk.gray('>'))
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
			console.log(
				`Make a directory ` +
					chalk.gray(__dirname + '/') +
					chalk.bold(dir) +
					'.'
			)
			executeCommand(`mkdir ${dir}`)
			return true
		}
		if (err.code === 'ENOTDIR') {
			console.log(chalk.red('Not directory.') + ' ' + chalk.gray(dir))
			return false
		}
	}
}

function prepareFile(path, templateFile) {
	if (!fs.existsSync(path)) {
		console.log(
			`Make a file ` + chalk.gray(__dirname + '/') + chalk.bold(path) + '.'
		)
		fs.writeFileSync(path, '')
		if (templateFile) {
			fs.createReadStream(templateFile).pipe(fs.createWriteStream(path))
		} else {
			executeCommand(`touch ${path}`)
		}
	} else if (fs.statSync(path).isDirectory()) {
		console.log(chalk.red('Not file.') + ' ' + chalk.gray(path))
		return false
	}
	return true
}

function runTestCase() {
	if (cases.length === 0) {
		console.log(`No TestCases.`)
		return
	}
	if (!compileState) {
		console.log(`Last Compile Failed.`)
		return
	}
	console.log(
		chalk.blue(`-------------------\n- Testing (${cases.length} case)\n`)
	)
	_.each(cases, (testCase, i) => {
		const res = execSync(`./${outputFile}`, { input: testCase.input })
		const ans = res.toString('utf8')
		if (testCase.expect === ans) {
			console.log(`  case ${i + 1} ` + chalk.green('OK'))
		} else {
			console.log(`  case ${i + 1} ` + chalk.red('NG'))
			console.log(' expect:')
			console.log(testCase.expect)
			console.log(' received:')
			console.log(chalk.red(ans))
		}
	})
	console.log(chalk.blue(`\n-------------------\n`))
}

const compileListener = async (event, filename) => {
	event && console.log(`Target changed: ` + chalk.bold(filename) + `.`)
	compileState = executeCommand(`g++ ${targetFile} -o ${outputFile}`)
	runTestCase()
}

const testcaseListener = async (event, filename) => {
	console.log(`Testcase updated: ` + chalk.bold(filename) + `.`)
	cases = loadTestcase(testcaseFile)
	runTestCase()
}

async function start() {
	if (!init()) {
		return
	}
	await sleep(500)
	console.log(
		'Watch start ' + chalk.bold(targetFile) + ' → ' + chalk.bold(outputFile)
	)

	fs.watch(targetFile, compileListener)
	cases = loadTestcase(testcaseFile)
	fs.watch(testcaseFile, testcaseListener)
	compileListener(null, targetFile)
}

function init() {
	return (
		prepareDir(outputDir) &&
		prepareFile(targetFile, templateTargetFile) &&
		prepareDir(testcaseDir) &&
		prepareFile(testcaseFile, templateTestcaseFile)
	)
}

module.exports = (_, opts) => {
	if (opts.init) {
		if (init()) {
			console.log('Successfly workspace prepared!')
		}
	} else {
		start()
	}
}
