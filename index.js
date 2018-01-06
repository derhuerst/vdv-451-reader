'use strict'

const duplexer = require('duplexer3')

const createFileReader = require('./lib/file-reader')
const createFileParser = require('./lib/file-parser')

const createReader = () => {
	const input = createFileReader()
	const output = createFileParser()

	input.pipe(output)
	const wrapper = duplexer({objectMode: true}, input, output)
	output.on('meta', meta => wrapper.emit('meta', meta))

	return wrapper
}

module.exports = createReader
