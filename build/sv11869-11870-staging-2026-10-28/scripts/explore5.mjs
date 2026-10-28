import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'staging',ticket:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin'});
const p=s.page; const cid='24e29b18-cde3-40f6-8ca4-1760beea1294'; const got=[];
p.on('response',async r=>{ if(/\/api\//.test(r.url())&&r.request().method()==='GET'&&/vehic|asset/i.test(r.url())){ try{got.push(r.url().replace(/^https:\/\/[^/]+/,'')+' '+JSON.stringify(await r.json()).slice(0,300));}catch{} } });
await s.go(`/customers/${cid}/vehicles`); await p.waitForTimeout(5000); console.log(got.join('\n'));
console.log('ws',JSON.stringify((await s.api('/api/staff/my-workplaces')).json).slice(0,400));
await s.close(); process.exit(0);
