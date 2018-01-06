'use strict'

const createReader = require('.')

const reader = createReader()
reader.on('data', console.log)
reader.on('error', console.error)

reader.end(`\
mod; YYYY/MM/DD; HH:MM:SS; aligned
src; "LIO-ADAPTER-VDV 4.0"; "1998/06/18"; "14:05:48"
chs; "ISO-8859-1"
ver; "Version_2.2"
ifv; "Version_1.7"
dve; "Nutzersicht_der_HPW_auf_das_OePNV-Datenmodell_4.0/4.1"
fft; "LIObus"

tbl; MENGE_ONR_TYP
atr; BASIS_VERSION; ONR_TYP_NR; STR_ONR_TYP; ONR_TYP_TEXT
frm; num[11.0]; num[11.0]; char[8]; char[32]
rec;           1;           1;       "HP";       "Haltepunkt"
rec;           1;           2;     "BHOF"; "Betriebshofpunkt"
rec;           1;           3;       "OM";        "Ortsmarke"
rec;           1;           4;      "LSA";        "LSA-Punkt"
end; 4

eof; 1`)
