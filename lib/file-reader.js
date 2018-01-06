'use strict'

const iconv = require('iconv-lite')
const through = require('through2')
const {LineStream} = require('byline')
const duplexer = require('duplexer3')

const createFileReader = () => {
	// While VDV-451 technically has a `chs` command to announce the charset of
	// the following data, it only allows for ISO8859-1 and ASCII encodings to
	// be used. In the future, peeking until the `chs` command might be necessary.
	const input = iconv.decodeStream('ISO8859-1')

	const output = through.obj((line, _, cb) => {
		const fields = line.split('; ')
		const res = {
			command: fields[0],
			args: []
		}

		for (let i = 1; i < fields.length; i++) {
			// While VDV-451 technically has a `mod` command to announce the
			// alignment of fields, I'm not sure it matters in practice.
			// Are there any features that depend on the presence of leading
			// or trailing spaces?
			let field = fields[i].trim()
			if (field.length >= 2 && field[0] === '"' && field[0] === '"') {
				field = field.slice(1, -1).replace(/""/, '"')
			}
			res.args.push(field)
		}
		cb(null, res)
	})

	input
	.pipe(new LineStream())
	.pipe(output)

	return duplexer({objectMode: true}, input, output)
}

module.exports = createFileReader
