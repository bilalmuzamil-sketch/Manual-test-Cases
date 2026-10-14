import {op as ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import {toCores,readCores,dlgButtons} from './wiz.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync(process.argv[2]+'.json')); const s=await ob(); const p=s.page; await loc(s);
await toCores(s,A); const c=await readCores(p); console.log('CORES',J(c,4000)); console.log('btns',J(await dlgButtons(p),600));
fs.writeFileSync(`data-${A.tag}-cores0.json`,JSON.stringify(c,null,1)); await p.screenshot({path:`ev/${A.tag}-cores0.png`});
await s.close();
