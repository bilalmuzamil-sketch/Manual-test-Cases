// find how New Payment / credit memo / reverse are driven: capture the app's own requests on the customer Payments + Invoices tabs
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]||'branch'; const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'11744',cookies,dir:(process.env.QA_DIR||'/tmp/qa23'),user:'bilal.muzamil@shopview.com'});
console.log(JSON.stringify(await s.marker()));
const caps=[]; s.page.on('request',r=>{ if(/shopview\.com\/api\//.test(r.url())) caps.push(r.method()+' '+r.url().replace(/^https:\/\/[^/]+/,'').slice(0,140)); });
await s.go('/customers/6a7b6afc-084d-4584-aacb-773bcd71cbcd/invoices'); await s.page.waitForTimeout(2500);
console.log('invoices tab', [...new Set(caps)].filter(x=>!/notif|release|punch|feature-flags|view-profile|my-workplaces|preferences|subscribe|technician-tasks/.test(x)).join('\n'));
const L=await s.page.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id')+'|'+(e.innerText||'').trim().slice(0,25)));
console.log([...new Set(L)].filter(x=>!/nav_link|module_|profile|notif|clock_in|global_search|skip/.test(x)).slice(0,60).join(' ;; '));
caps.length=0; await s.go('/customers/6a7b6afc-084d-4584-aacb-773bcd71cbcd/payments'); await s.page.waitForTimeout(2500);
console.log('payments tab', [...new Set(caps)].filter(x=>!/notif|release|punch|feature-flags|view-profile|my-workplaces|preferences|subscribe|technician-tasks/.test(x)).join('\n'));
const L2=await s.page.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id')+'|'+(e.innerText||'').trim().slice(0,25)));
console.log([...new Set(L2)].filter(x=>!/nav_link|module_|profile|notif|clock_in|global_search|skip/.test(x)).slice(0,60).join(' ;; '));
await s.close();
