import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; const W=JSON.parse(fs.readFileSync('/tmp/sv12003/seed-branch-s1.json','utf8')).wo;
await s.go('/workorders/'+W+'/lines'); await p.waitForTimeout(3500);
const t=await p.evaluate(async(name)=>{ const u=performance.getEntriesByType('resource').map(e=>e.name).find(x=>x.includes(name)); return u?(await (await fetch(u)).text()):null; },process.argv[2]);
const ids=[...new Set((t.match(/"data-test-id":"[^"]+"|data-test-id-suffix":"[^"]+"|"(?:title|label)":"[^"]{2,40}"|"[A-Z][a-z]+ notes?"/g)||[]))]; console.log(ids.join('\n')); console.log('spellcheck mentions',(t.match(/spellcheck[^,]{0,30}/g)||[]));
await s.close(); process.exit(0);
