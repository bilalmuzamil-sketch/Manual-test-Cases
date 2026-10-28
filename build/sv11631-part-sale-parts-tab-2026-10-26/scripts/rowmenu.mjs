import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const ps=process.argv[2];
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:(process.env.QA_DIR||'/tmp/qa26'),vp:{width:1440,height:900}}); const p=s.page;
await s.go(`/parts/part-sale/${ps}/part-requests`); await p.waitForTimeout(6000);
console.log('tids',[...new Set(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g,'<id>'))))].filter(t=>/action|menu|adjust|fee|discount|kebab|more/i.test(t)).join(' '));
const k=p.locator('[data-test-id^="button_part_request_menu_"]').first();
if(await k.count()){ await k.click(); await p.waitForTimeout(1200); console.log('menu',await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.getAttribute('data-test-id')||'')+'|'+e.innerText.replace(/\s+/g,' ').trim()).join(' ;; '))); }
await p.screenshot({path:'/tmp/qa11631/rowmenu.png'}); await s.close();
