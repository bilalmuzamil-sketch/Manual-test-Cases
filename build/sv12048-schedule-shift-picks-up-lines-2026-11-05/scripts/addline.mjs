// usage: node addline.mjs <tag> <status> [cannedName] -> adds one canned line with that status; appends id to wo-<tag>.json
import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const [TAG,ST,CAN]=process.argv.slice(2); const F=`/tmp/sv12048/wo-${TAG}.json`; const S=JSON.parse(fs.readFileSync(F,'utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200);
const can=arr((await s.api('/api/work-orders/canned-lines')).json?.data).find(x=>x.canned_line_name.trim()===(CAN||S.canned));
const body={canned_line_id:can.id}; if(ST!=='none') body.status=ST; const l=await post(s,'/api/work-orders/'+S.wo+'/lines/create-from-canned-line',body); console.log('create',l.status,JSON.stringify(l.json).slice(0,200));
const id=l.json?.data?.line_id; if(id){ S.lines.push(id); fs.writeFileSync(F,JSON.stringify(S,null,1)); }
const v=JSON.stringify((await s.api('/api/work-orders/lines/'+S.wo)).json); const i=v.indexOf(id); const m=v.slice(i,i+3000).match(/"status":"([^"]*)"/); console.log('new line',id,'status now',m&&m[1]); await s.close(); process.exit(0);
