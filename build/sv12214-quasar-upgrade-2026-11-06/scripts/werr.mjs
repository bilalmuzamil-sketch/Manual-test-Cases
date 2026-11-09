import {sess} from './common.mjs'; const s=await sess({vp:{width:1600,height:900}}); const p=s.page; const L=[]; let step='load';
p.on('pageerror',e=>L.push(step+' | pageerror | '+e.message.slice(0,140))); p.on('console',m=>{ if(m.type()==='error') L.push(step+' | console | '+m.text().slice(0,140)); });
p.on('requestfailed',r=>{ if(/view-profile/.test(r.url())) L.push(step+' | reqfailed | '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(r.failure()?.errorText||'')); });
await s.go('/workorders'); await p.waitForTimeout(5000);
step='open module switcher'; await p.click('[data-test-id=module_selector_trigger]'); await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(800);
step='open profile menu'; await p.click('[data-test-id=profile_menu_button]'); await p.waitForTimeout(1500);
step='click Settings'; await p.locator('.q-menu .q-item').filter({hasText:'Settings'}).first().click(); await p.waitForTimeout(4000);
step='idle'; await p.waitForTimeout(2000); for(const l of L) console.log(l); console.log('total',L.length); await s.close(); process.exit(0);
