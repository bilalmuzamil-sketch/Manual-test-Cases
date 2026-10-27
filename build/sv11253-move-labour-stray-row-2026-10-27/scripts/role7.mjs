import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess();
const r=await s.api('/api/fe-permissions'); const t=JSON.stringify(r.json); fs.writeFileSync('../data/fe-permissions.json',JSON.stringify(r.json,null,1));
const names=[...t.matchAll(/"(?:name|code)":"([^"]+)"/g)].map(m=>m[1]); console.log(names.length, names.filter(n=>/^wo|labo|move/i.test(n)).join(', '));
await s.browser.close(); process.exit(0);
