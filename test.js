'use strict'

const test = require('tape')

const createReader = require('.')

const input = `\
mod; YYYY/MM/DD; HH:MM:SS; aligned
src; "foo"; "2017/06/08"; "18:31:18"
chs; "ISO-8859-1"
ver; "bar"
ifv; "baz"
dve; "hey"
fft; "should be ignored"

tbl; there
atr; BASIS_VERSION; ONR_TYP_NR; STR_ONR_TYP; ONR_TYP_TEXT
frm; num[11.0]; num[11.0]; char[8]; char[32]
rec;           1;           1;       "HP";       "Haltepunkt"
rec;           1;           2;     "BHOF"; "Betriebshofpunkt"
rec;           1;           3;       "OM";        "Ortsmarke"
rec;           1;           4;      "LSA";        "LSA-Punkt"
end; 4

eof; 1`

const expected = [ {
	BASIS_VERSION: 1,
	ONR_TYP_NR: 1,
	STR_ONR_TYP: 'HP',
	ONR_TYP_TEXT: 'Haltepunkt'
}, {
	BASIS_VERSION: 1,
	ONR_TYP_NR: 2,
	STR_ONR_TYP: 'BHOF',
	ONR_TYP_TEXT: 'Betriebshofpunkt'
}, {
	BASIS_VERSION: 1,
	ONR_TYP_NR: 3,
	STR_ONR_TYP: 'OM',
	ONR_TYP_TEXT: 'Ortsmarke'
}, {
	BASIS_VERSION: 1,
	ONR_TYP_NR: 4,
	STR_ONR_TYP: 'LSA',
	ONR_TYP_TEXT: 'LSA-Punkt'
} ]

const when = new Date('2017-06-08T18:31:18.000+0200')

test('simple example from VDV-451 docs', (t) => {
	const reader = createReader()
	reader.on('error', t.ifError)
	reader.once('end', () => t.end())

	let rowI = 0
	reader.on('data', (row) => {
		t.deepEqual(row, expected[rowI], `row ${rowI}`)
		rowI++
	})
	reader.end(input)
})

test('emit meta information', (t) => {
	const reader = createReader()
	reader.once('end', () => t.end())
	reader.on('data', () => {})

	reader.once('meta', (meta) => {
		t.ok(meta)
		t.equal(meta.generator, 'foo')
		t.equal(meta.version, 'bar')
		t.equal(meta.interfaceVersion, 'baz')
		t.equal(meta.dataRevision, 'hey')
		t.equal(meta.table, 'there')
		t.equal(+meta.created, +when)
	})
	reader.end(input)
})
