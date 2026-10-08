import {ob} from './lib.mjs'; import fs from 'fs'; import {row} from './h.mjs';
const X=JSON.parse(fs.readFileSync('ids-repro.json')); const s=await ob({dpr:1}); await s.go('/accounting/banking/transactions');
for(const k of ['11','12']) console.log(k, JSON.stringify(await row(s,X.rows[k])));
await s.close();
