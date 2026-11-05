// usage: [ENV=prod] node explore.mjs <woId> -> lists text-edit related controls on the Lines tab + line context menu + Customer/Vehicle note controls
import {sess} from './common.mjs';
const s=await sess(); const p=s.page; const wo=process.argv[2];
await s.go('/workorders/'+wo+'/lines'); await p.waitForTimeout(4000);
const ids=async(re)=>p.evaluate(r=>[...document.querySelectorAll('[data-test-id]')].filter(b=>b.offsetParent&&new RegExp(r,'i').test(b.getAttribute('data-test-id'))).map(b=>b.getAttribute('data-test-id')+'='+b.innerText.trim().replace(/\s+/g,' ').slice(0,30)),re);
console.log('LINES', await ids('story|note|edit|new_line|add_line|expand'));
await p.locator('[data-test-id="line_title"]').first().click({button:'right'}); await p.waitForTimeout(1500); console.log('MENU', await ids('menu-item')); await p.keyboard.press('Escape');
await s.go('/workorders/'+wo+'/details').catch(()=>{}); await p.waitForTimeout(3000); console.log('DETAILS', (await ids('note|edit')).slice(0,40));
await s.close(); process.exit(0);
