import {open} from './qa.mjs'; import fs from 'fs';
const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const s=await open({env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'tech',vp:{width:1600,height:1000},dpr:2}); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
const pr=await s.api('/api/users/me/preferences/work-orders-list'); console.log('PREFKEYS',Object.keys(pr.json?.data?.value||{}).join(','));
const H=()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id=table_tech_view] th')].map(t=>t.innerText.trim()).filter(Boolean).join(' | '));
const tog=async k=>{ await p.click('[data-test-id=button_tech_view_column_selection]'); await p.waitForTimeout(800); await p.click(`[data-test-id=toggle_tech_view_column_${k}]`); await p.waitForTimeout(1200); await p.keyboard.press('Escape'); await p.waitForTimeout(1500); };
console.log('0',await H());
for(const k of ['vehicle_here','vin','technician']){ await tog(k); console.log('+'+k,await H()); }
for(const k of ['vehicle_here','vin','technician']) await tog(k);
console.log('back',await H());
await tog('assigned_techs'); console.log('-assigned',await H()); await tog('assigned_techs'); console.log('+assigned',await H());
await s.close();
