import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const s=await sess(); const p=s.page;
await s.go('/workorders'); await p.waitForTimeout(2500); await p.click('[data-test-id="profile_menu_button"]'); await p.waitForTimeout(1000); await p.click('[data-test-id="button_night_mode_dark"]'); await p.keyboard.press('Escape');
await s.go('/imported-work-orders/'+process.env.ID); await p.waitForTimeout(6000);
const b=p.locator('main button:has-text("get_app")').first(); const dl=p.waitForEvent('download',{timeout:30000}).catch(()=>null); await b.click(); const d=await dl;
if(d){ const f=`../ev/${ENV}/download-dark.pdf`; await d.saveAs(f); console.log('saved',f); } else console.log('no download; url',p.url());
await s.close(); process.exit(0);
