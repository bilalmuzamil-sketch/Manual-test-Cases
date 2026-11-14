import {sess} from './common.mjs';
const s=await sess({dir:'/tmp/qa81'}); const p=s.page; const reqs=[]; p.on('request',r=>{ if(/ar-aging-summary\?/.test(r.url())) reqs.push(decodeURIComponent(r.url()).replace(/^.*\?/,'')); });
await s.go('/reports/ar-aging-summary?asOfDate=2026-12-31'); await p.waitForTimeout(5000); console.log('req',reqs[0]);
const dump=async lbl=>console.log(lbl,[...new Set(await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id], .q-dialog [data-test-id], [role=menu] [data-test-id]')].map(e=>e.getAttribute('data-test-id')+'::'+(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,40))))].slice(0,25).join(' || '));
for(const c of ['filter_chip_pastDue','filter_chip_locationIds','btn_dropdown_arsum_export']){ await s.glideClick(c); await p.waitForTimeout(1200); await dump(c); await p.keyboard.press('Escape'); await p.waitForTimeout(600); }
await s.glideClick('profile_menu_button'); await p.waitForTimeout(1200); console.log('profile',(await p.locator('.q-menu').last().innerText().catch(()=>'')).replace(/\n/g,' | ').slice(0,400)); await dump('profile');
await s.close(); process.exit(0);
