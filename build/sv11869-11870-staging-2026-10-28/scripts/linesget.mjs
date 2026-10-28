import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const WO='99e6423d-3b81-4a2a-803f-5b22d7b04f86', LOC='b3c8c820-f815-4cf1-8938-10956c5ee71a';
const s=await open({env:'staging',ticket:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin',vp:{width:1440,height:900}});
const p=s.page; const got=[]; p.on('response',async r=>{ if(/\/api\//.test(r.url())&&r.request().method()==='GET'&&/line/i.test(r.url())){ try{got.push([r.url().replace(/^https:\/\/[^/]+/,''),await r.text()]);}catch{} } });
await s.go('/workorders'); await p.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC); await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(6000);
for(const [u,t] of got) console.log(u.slice(0,120), t.length, (t.match(/"(name|line_name|title|status)":"[^"]*"/g)||[]).slice(0,30).join(' ').slice(0,700));
console.log('row buttons',JSON.stringify([...new Set(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g,'<id>'))))].join(' ; ').slice(0,1500)));
await p.screenshot({path:'/tmp/qa30/lines.png',fullPage:true});
await s.close(); process.exit(0);
