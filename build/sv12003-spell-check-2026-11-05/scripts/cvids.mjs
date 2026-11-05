import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; const W=JSON.parse(fs.readFileSync('/tmp/sv12003/seed-branch-s1.json','utf8')).wo;
const ids=async()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(b=>b.offsetParent&&/note|pin|edit/i.test(b.getAttribute('data-test-id')+b.innerText)).map(b=>b.getAttribute('data-test-id')+'='+b.innerText.trim().replace(/\s+/g,' ').slice(0,30)));
for(const l of ['link_customer_card_name','vehicle_card_title_link']){ await s.go('/workorders/'+W+'/lines'); await p.waitForTimeout(3000); await p.locator(`[data-test-id="${l}"]`).click(); await p.waitForTimeout(4000); console.log('==',l,p.url().replace(/^https:\/\/[^/]+/,'')); console.log((await ids()).slice(0,30)); await p.screenshot({path:'../ev/branch-'+l+'.png'}); }
await s.close(); process.exit(0);
