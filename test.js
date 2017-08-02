import test from 'ava'
import m from '.'

// TODO
test('title', t => {
	const err = t.throws(() => {
		m(123)
	}, TypeError)
	t.is(err.message, 'Expected a string, got number')

	t.is(m('unicorns'), 'unicorns & rainbows')
})
