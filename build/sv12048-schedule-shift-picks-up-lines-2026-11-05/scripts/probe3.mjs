import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('/tmp/sv12048/wo-B.json','utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200);
const can=arr((await s.api('/api/work-orders/canned-lines')).json?.data).find(x=>x.canned_line_name.trim()===S.canned);
for(const st of [undefined,'not_authorized','unauthorized','waiting_for_approval']){ const b={canned_line_id:can.id}; if(st) b.status=st; const l=await post(s,'/api/work-orders/'+S.wo+'/lines/create-from-canned-line',b); console.log(st,l.status,JSON.stringify(l.json).slice(0,160)); if(l.status<300) break; }
await s.close(); process.exit(0);
