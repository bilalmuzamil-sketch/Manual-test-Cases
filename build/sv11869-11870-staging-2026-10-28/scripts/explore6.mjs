import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'staging',ticket:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin'});
const p=s.page; const got=[]; p.on('response',async r=>{ if(/work-orders\?pagination/.test(r.url())){ try{got.push(await r.json());}catch{} } });
console.log('workplaces',((await s.api('/api/staff/my-workplaces')).json?.data?.collection||[]).map(w=>w.name+'|'+w.id).join(' ; '));
await s.go('/workorders'); await p.waitForTimeout(6000);
const ws=got.flatMap(j=>j?.data?.work_orders||[]); console.log('n',ws.length); const w=ws[0]; console.log('keys',Object.keys(w||{}).join(','));
console.log(ws.slice(0,5).map(w=>[w.raw_number||w.number,JSON.stringify(w.status).slice(0,30),w.company_id||w.company?.id,w.vehicle_id||w.vehicle?.id,w.company_name||w.company?.name].join(' | ')).join('\n'));
await s.close(); process.exit(0);
