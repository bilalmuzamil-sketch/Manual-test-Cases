import {ob} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:1}); const R=JSON.parse(fs.readFileSync('ids.json'));
for(const x of ['A','B']){ const je=(await s.api('/api/accounting/journal-entries/'+R['je'+x])).json; const t=JSON.stringify(je); console.log(x,'entry keys',Object.keys(je.entry).join(','),'| line keys',Object.keys(je.entry.lines[0]).join(','));
 console.log(x,'party mentions',(t.match(/.{40}(Star|customer|vendor|party)[^,]{0,60}/gi)||[]).slice(0,8)); }
await s.close();
