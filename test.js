import fs from 'fs'
import mock from 'mock-fs'
import test from 'ava'

const compep = require('.')

test.beforeEach(() => {
	mock({
		'mock-dir/note': 'hello2',
	})
})

test.afterEach(() => {})

test('file io', async t => {
	t.is(1, 2)
	fs.writeFileSync('mock-dir/note2', 'hello')
	const a = fs.readFileSync('mock-dir/note2', 'utf8')
	t.is(a, 'hello')

	const b = fs.readFileSync('mock-dir/note', 'utf8')
	t.is(b, 'hello')
})
