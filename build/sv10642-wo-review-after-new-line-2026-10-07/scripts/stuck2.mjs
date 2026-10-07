import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob(); const {wo}=JSON.parse(fs.readFileSync('wo-K.json'));
const v=await s.api('/api/work-orders/lines/'+wo); console.log(v.status, j(v.json,200));
const ls=v.json?.data?.lines||v.json?.data?.collection||v.json?.data; console.log(Array.isArray(ls), ls&&j(ls.map?ls.map(l=>[l.status,l.line_status,l.statusName]):Object.keys(ls),300));
await s.close();
