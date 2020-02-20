const fs = require('fs')
const test = require('ava')

const compep = require('.')

test.beforeEach(() => {})

test.afterEach(() => {
	fs.unlinkSync('main.cpp')
	fs.unlinkSync('testcase/main.testcase.txt')
	fs.rmdirSync('testcase')
})

test('file io', async t => {
	compep('', { init: true })
	t.true(fs.existsSync('main.cpp'))
	t.true(fs.existsSync('testcase/main.testcase.txt'))
})
