import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,tag,...paths]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/s11744/seed-${env}-${tag}.json`,'utf8'));
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'11744',cookies,dir:(process.env.QA_DIR||'/tmp/qa23'),user:'bilal.muzamil@shopview.com'}); const p=s.page;
for(const pa of paths){ await s.go(pa.replace('{cid}',S.cid).replace('{dep}',S.depWo||'')); await p.waitForTimeout(3000);
 for(const h of await p.$$('[data-test-id^="button_toggle_payment_expansion_"]')){ await h.click().catch(()=>{}); await p.waitForTimeout(400); }
 console.log('==',pa); console.log(await p.evaluate(()=>(document.querySelector('main, .q-page')?.innerText||'').replace(/\s+/g,' ').slice(0,1500)));
 console.log('tids',await p.evaluate(()=>[...new Set([...document.querySelectorAll('main [data-test-id], .q-page [data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id').replace(/[0-9a-f-]{36}/,'<id>')))].join(' ').slice(0,1500))); }
await s.close();
