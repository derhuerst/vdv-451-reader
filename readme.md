# vdv-451-reader

**A streaming [VDV 451](https://www.vdv.de/oepnv-datenmodell.aspx) reader.**

[![npm version](https://img.shields.io/npm/v/vdv-451-reader.svg)](https://www.npmjs.com/package/vdv-451-reader)
[![build status](https://api.travis-ci.org/derhuerst/vdv-451-reader.svg?branch=master)](https://travis-ci.org/derhuerst/vdv-451-reader)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vdv-451-reader.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## Installing

```shell
npm install vdv-451-reader
```


## Usage

```js
const createReader = require('vdv-451-reader')

const reader = createReader()
reader.on('data', console.log)
reader.on('error', console.error)

reader.end(`\
mod; YYYY/MM/DD; HH:MM:SS; aligned
src; "LIO-ADAPTER-VDV 4.0"; "1998/06/18"; "14:05:48"
chs; "ISO-8859-1"
fft; "LIObus"

tbl; MENGE_ONR_TYP
atr; BASIS_VERSION; ONR_TYP_NR; STR_ONR_TYP; ONR_TYP_TEXT
frm; num[11.0]; num[11.0]; char[8]; char[32]
rec;           1;           1;       "HP";       "Haltepunkt"
rec;           1;           2;     "BHOF"; "Betriebshofpunkt"
end; 4

eof; 1`)
```

```js
{
	BASIS_VERSION: 1,
	ONR_TYP_NR: 1,
	STR_ONR_TYP: 'HP',
	ONR_TYP_TEXT: 'Haltepunkt'
}
{
	BASIS_VERSION: 1,
	ONR_TYP_NR: 2,
	STR_ONR_TYP: 'BHOF',
	ONR_TYP_TEXT: 'Betriebshofpunkt'
}
```


## API

```js
createReader()
```

`createReader` returns a [readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) in [object mode](https://nodejs.org/api/stream.html#stream_object_mode).


## Contributing

If you have a question or have difficulties using `vdv-451-reader`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/vdv-451-reader/issues).
