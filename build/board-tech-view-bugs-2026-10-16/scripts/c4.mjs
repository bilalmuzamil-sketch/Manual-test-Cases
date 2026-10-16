import {open} from './qa.mjs'; import fs from 'fs';
const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const s=await open({env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'tech',vp:{width:1600,height:1000},dpr:2}); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
const fe=await s.api('/api/auth/me/fe-permissions'); console.log('FE',JSON.stringify(fe.json?.data).slice(0,500));
const pr=await s.api('/api/users/me/preferences/work-orders-list'); console.log('PREF',JSON.stringify(pr.json?.data?.value||pr.json).slice(0,400));
console.log('url',p.url(),'switch?',!!await p.$('[data-test-id=toggle_display_option]'));
if(await p.$('[data-test-id=toggle_display_option]')){ await p.click('[data-test-id=toggle_display_option]'); await p.waitForTimeout(700); await p.click('[data-test-id=display_option_tech_view]'); await p.waitForTimeout(5000);
 console.log('HEADERS',await p.evaluate(()=>[...document.querySelectorAll('[data-test-id=table_tech_view] th')].map(t=>t.innerText.trim()).filter(Boolean).join(' | ')));
 await p.click('[data-test-id=button_tech_view_column_selection]'); await p.waitForTimeout(1000);
 console.log('MENU',await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim().replace(/\s+/g,' ')).join(' | ')));
 await p.screenshot({path:'/tmp/qa11310/c4-tech.png'}); }
await s.close();
