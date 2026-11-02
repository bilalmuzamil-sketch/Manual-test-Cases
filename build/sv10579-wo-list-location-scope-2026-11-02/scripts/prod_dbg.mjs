import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const s=await open({env:'prod',dir:'/tmp/qa2',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim()});
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const w=wps.find(x=>x.name==='Truck Hill 1'); await s.api('/api/iam/change-location',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:w.id,workplace_timezone:w.timezone})});
const o=await s.api('/api/inventory/orders/f30878c7-3274-4f37-b97d-88eaeb3e8992'); const d=o.json?.data; console.log(o.status,'top',Object.keys(d||{}).join(','),'order keys',Object.keys(d?.order||{}).filter(k=>/work|place|loc|shop/i.test(k)).join(','));
console.log(JSON.stringify(o.json).slice(0,600));
process.exit(0);
