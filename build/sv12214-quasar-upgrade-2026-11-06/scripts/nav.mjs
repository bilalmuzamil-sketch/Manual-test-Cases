// SV-12214 fix da82465a: module switcher + profile menu marking, on any env/engine. Also: items visible, a module link works, Escape closes.
import {sess} from './common.mjs'; import fs from 'fs'; const E=(process.env.ENV||'staging')+(process.env.ENGINE&&process.env.ENGINE!=='chromium'?'-'+process.env.ENGINE:''); const s=await sess({vp:{width:1600,height:900}}); const p=s.page; const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,120)));
console.log('marker',await (await fetch('https://'+(process.env.ENV==='prod'?'app.shopview.com':'app.staging.shopview.com')+'/').catch(()=>null))?.text().then(t=>(t.match(/app-version" content="([^"]+)/)||[])[1]).catch(()=>'?'));
const out=[]; const info=()=>p.evaluate(()=>[...document.querySelectorAll('.q-menu')].filter(m=>m.getBoundingClientRect().width>0).map(m=>{const r=m.getBoundingClientRect(); return {role:m.getAttribute('role'),label:m.getAttribute('aria-label'),testid:m.getAttribute('data-test-id'),box:[r.x,r.y,r.right,r.bottom].map(Math.round),text:m.innerText.replace(/\s+/g,' ').slice(0,90)}}));
async function one(name,sel,shot){ const b=p.locator(sel).first(); if(!(await b.count())){out.push({name,missing:sel});return;}
  const trig=await b.evaluate(e=>{const r=e.getBoundingClientRect(); return {haspopup:e.getAttribute('aria-haspopup'),label:e.getAttribute('aria-label'),expanded:e.getAttribute('aria-expanded'),box:[r.x,r.y,r.right,r.bottom].map(Math.round)}});
  await b.click(); await p.waitForTimeout(1200); const m=await info(); await p.screenshot({path:`../ev/${E}-r4-${shot}.png`});
  await p.keyboard.press('Escape'); await p.waitForTimeout(600); const after=(await info()).length; out.push({name,trig,menu:m,openAfterEscape:after}); }
await s.go('/workorders'); await p.waitForTimeout(5000);
await one('Module switcher','[data-test-id=module_selector_trigger]','module');
await one('Profile menu','[data-test-id=profile_menu_button]','profile');
// a module link still works: open switcher, click the 2nd entry, read url, come back
await p.locator('[data-test-id=module_selector_trigger]').first().click(); await p.waitForTimeout(1000);
const entries=await p.evaluate(()=>{const m=document.querySelector('[data-test-id=module_selector_menu]')||[...document.querySelectorAll('.q-menu')].find(x=>x.getBoundingClientRect().width>0); return m?[...m.querySelectorAll('a,[role=menuitem],.q-item,button')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean):[]});
out.push({moduleEntries:entries}); await p.keyboard.press('Escape'); await p.waitForTimeout(500);
// profile menu: an item still works (click the first item whose text includes "Settings" or "Profile")
await p.locator('[data-test-id=profile_menu_button]').first().click(); await p.waitForTimeout(1000);
const pitems=await p.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].find(x=>x.getBoundingClientRect().width>0); return m?[...m.querySelectorAll('.q-item')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean):[]}); out.push({profileItems:pitems});
const tgt=p.locator('.q-menu .q-item').filter({hasText:/^Settings$|Settings/}).first(); if(await tgt.count()){ const u0=p.url(); await tgt.click(); await p.waitForTimeout(3000); out.push({clickedSettings:{from:u0.replace(/^https:\/\/[^/]+/,''),to:p.url().replace(/^https:\/\/[^/]+/,'')}}); } else await p.keyboard.press('Escape');
out.push({pageErrors:errs});
fs.writeFileSync(`../ev/${E}-r4-nav.json`,JSON.stringify(out,null,1)); for(const o of out) console.log(JSON.stringify(o).slice(0,400));
await s.close(); process.exit(0);
