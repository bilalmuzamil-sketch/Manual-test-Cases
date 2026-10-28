import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const S=JSON.parse(fs.readFileSync(`/tmp/s10928/seed-${env}.json`,'utf8')); const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'10928',cookies,dir:(process.env.QA_DIR||'/tmp/qa21'),user:'bilal.muzamil@shopview.com'}); const p=s.page;
await s.go(`/workorders/${S.wo.work_order_id}/lines`); await p.waitForTimeout(2500);
const href=await p.evaluate(()=>document.querySelector('[data-test-id="vehicle_card_title_link"]')?.getAttribute('href')); console.log('asset link',href);
if(href){ await s.go(href.replace(/^https?:\/\/[^/]+/,'')); await p.waitForTimeout(2500);
  const L=await p.evaluate(()=>[...document.querySelectorAll('button,a,[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>[(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,30),e.getAttribute('data-test-id')||'',e.getAttribute('aria-label')||''].filter(Boolean).join('|')));
  console.log(p.url().replace(s.host.app,''),'\n',[...new Set(L)].filter(x=>!/nav_link|module_|profile|notif|clock_in|global_search|skip-to/.test(x)).slice(0,60).join(' ;; ')); }
const caps=[]; p.on('request',r=>{ if(r.method()!=='GET'&&/shopview\.com\/api/.test(r.url())) caps.push(r.method()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(r.postData()||'').slice(0,200)); });
await s.close();
