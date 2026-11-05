import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${process.argv[2]}.json`,'utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200);
const v=(await s.api('/api/work-orders/lines/'+S.wo)).json; fs.writeFileSync('/tmp/sv12048/lines-raw.json',JSON.stringify(v,null,1)); console.log(JSON.stringify(v).slice(0,200));
const walk=(o,d=0)=>{ if(Array.isArray(o)) return o.forEach(x=>walk(x,d)); if(o&&typeof o==='object'){ if(o.line_id) console.log('LINE keys',Object.keys(o).join(',').slice(0,900)); else for(const v of Object.values(o)) walk(v,d+1);} }; walk(v);
await s.close(); process.exit(0);
