'use strict'

const through = require('through2')

const parseDateTime = require('./parse-date-time')

// todo: support multiple tables per file
const createFileParser = (reader) => {
	let dateFormat = null, timeFormat = null
	const meta = {}
	let columnNames = null, columnFormats = null
	let rows = 0

	const out = through.obj((item, _, cb) => {
		// ignored commands: `chs`, `fft`, `com`
		if (item.command === 'mod') {
			dateFormat = item.args[0]
			timeFormat = item.args[1]
		} else if (item.command === 'src') {
			meta.generator = item.args[0]
			const date = item.args[1]
			const time = item.args[2]
			meta.created = parseDateTime(dateFormat, date, timeFormat, time)
		} else if (item.command === 'ver') {
			meta.version = item.args[0]
		} else if (item.command === 'ifv') {
			// todo: that is the difference to `ver`?
			meta.interfaceVersion = item.args[0]
		} else if (item.command === 'dve') {
			meta.dataRevision = item.args[0]
		} else if (item.command === 'tbl') { // table begin
			meta.table = item.args[0]
			out.emit('meta', meta)
		} else if (item.command === 'atr') { // column names
			columnNames = item.args
		} else if (item.command === 'frm') { // column formats
			columnFormats = []
			for (let arg of item.args) {
				if (arg.slice(0, 3) === 'num') columnFormats.push(parseFloat)
				else if (arg.slice(0, 4) === 'char') columnFormats.push(raw => raw)
				else return cb(new Error(`Unknown column format ${arg}.`))
			}
		} else if (item.command === 'rec') { // row
			rows++
			const row = Object.create(null)

			for (let i = 0; i < item.args.length; i++) {
				const key = columnNames[i]
				const parse = columnFormats[i]
				if (!key || !parse) {
					return cb(new Error(`Row ${rows}: Too many columns.`))
				}
				row[key] = parse(item.args[i])
			}

			return cb(null, row)
		} else if (item.command === 'end') { // end of table
			const count = parseInt(item.args[0])
			if (rows !== count) {
				return cb(new Error(`Expected ${count} records, but got ${rows}.`))
			}
		}
		cb()
	})

	return out
}

module.exports = createFileParser
