import {open} from './qa.mjs'; import fs from 'fs';
const env=process.argv[2]; const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const o= env==='prod'? {env:'prod',dir:'/tmp/qa11310',user:'bilal.muzamil@shopview.com'} : {env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin'};
const s=await open(Object.assign(o,{vp:{width:1600,height:1000},dpr:1})); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
if(await p.$('[data-test-id=toggle_display_option]')){ await p.click('[data-test-id=toggle_display_option]'); await p.waitForTimeout(700); await p.click('[data-test-id=display_option_list]'); await p.waitForTimeout(3500);}
const tids=await p.evaluate(()=>[...document.querySelectorAll('button[data-test-id], [data-test-id*=column]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/column|field/i.test(t)));
console.log(env,'tids',tids.slice(0,10).join(' '));
const b=tids.find(t=>/column_selection|columns/.test(t)); if(b){ await p.click(`[data-test-id=${b}]`); await p.waitForTimeout(1000);}
console.log(env,'OPTIONS',await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim().replace(/\s+/g,' ')).join(' | ')));
await s.close();
