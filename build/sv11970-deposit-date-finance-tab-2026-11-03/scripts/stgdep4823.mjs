import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const rs=f=>fs.readFileSync('/tmp/staging/'+f,'utf8').trim();
const s=await open({env:'staging',cookies:{sv_sso_session:rs('sso'),PHPSESSID:rs('phpsess'),cf_clearance:rs('cfc')},quick:'admin',dir:'/tmp/qa53',vp:{width:1440,height:900},tz:'America/Edmonton'});
const p=s.page; const hits=[]; const {setLoc}=await import('./loc.mjs'); console.log('loc',await setLoc(s,'DVI Test'));
p.on('response',async r=>{ if(r.request().method()!=='GET') return; let t=''; try{t=await r.text()}catch{} for(const k of ['DEP-4823','DEP-4822','DEP-4821','DEP-4824']){ const i=t.indexOf(k); if(i>=0) hits.push(r.url().replace(/^https:\/\/[^/]+/,'').slice(0,90)+' :: '+t.slice(Math.max(0,i-200),i+400).replace(/\s+/g,' ')); } });
await s.go('/customers/a63836b3-ae77-4bb9-8f13-3784e0e22212/deposits'); await p.waitForTimeout(6000);
const tog=p.locator('text=Open only').first(); if(await tog.count()){ await tog.click().catch(()=>{}); await p.waitForTimeout(4000); }
const rows=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(tr=>tr.innerText.replace(/\s+/g,' ').trim()).filter(t=>/DEP-48(2[0-5])/.test(t)));
console.log(JSON.stringify(rows,null,1)); console.log(hits.slice(0,4).join('\n---\n'));
await p.screenshot({path:'ev/stg12161-dvi-customer-deposits-all.png'});
await s.close(); process.exit(0);
