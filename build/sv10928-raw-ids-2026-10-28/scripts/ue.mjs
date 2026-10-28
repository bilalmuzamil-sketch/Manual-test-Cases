import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env]=process.argv.slice(2);
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'}); const p=s.page;
const reqs=[]; p.on('response',async r=>{ if(/\/api\/(reporting|accounting|quickbooks|bookkeeping|unexported)/i.test(r.url())) reqs.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'').slice(0,150)+' '+(await r.text().catch(()=>'')).slice(0,300)); });
await s.go('/reports/unexported-items'); await p.waitForTimeout(7000);
const tabs=await p.evaluate(()=>[...document.querySelectorAll('.q-tab')].map(t=>t.innerText.replace(/\s+/g,' ').trim())); console.log('tabs',tabs.join(' | '));
const jt=p.locator('.q-tab',{hasText:/Journal/i}).first(); if(await jt.count()){ await jt.click(); await p.waitForTimeout(5000); }
console.log('table',(await p.evaluate(()=>{const t=document.querySelector('table'); return t?t.innerText.replace(/\t/g,' | ').slice(0,1200):'(no table) '+document.body.innerText.slice(0,400)})));
console.log(reqs.join('\n').slice(0,2500)); await p.screenshot({path:'/tmp/s10928/ue-'+env+'.png'}); await s.close(); process.exit(0);
