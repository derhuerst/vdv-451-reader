'use strict'

const duplexer = require('duplexer3')

const createFileReader = require('./lib/file-reader')
const createFileParser = require('./lib/file-parser')

const createReader = () => {
	const input = createFileReader()
	const output = createFileParser()

	input.pipe(output)
	return duplexer({objectMode: true}, input, output)
}

module.exports = createReader
