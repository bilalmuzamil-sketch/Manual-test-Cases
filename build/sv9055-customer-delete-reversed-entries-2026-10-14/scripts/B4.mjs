import {ob,J} from './lib.mjs'; import {loc,invoiced,payUI} from './seed.mjs'; import fs from 'fs';
const s=await ob(); await loc(s);
const A=await invoiced(s,'ZZAUTOTEST SV9055 B4 pay-reversed-invoice-open '+Date.now()%100000);
fs.writeFileSync('B4.json',JSON.stringify(A)); await payUI(s,A,'ZZ9055-B4');
await s.close();
