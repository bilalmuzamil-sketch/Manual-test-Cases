import {sess} from './common.mjs'; import fs from 'fs'; const E=process.env.ENV||'staging'; const s=await sess({vp:{width:1600,height:900}}); const p=s.page;
const st=process.env.ST||'in_progress';
const r=await s.api(`/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=5&filters[0][field]=status&filters[0][value]=${st}&search=&showMyWorkOrders=0`); const wo=(r.json?.data?.work_orders||[])[0]; console.log('wo',wo?.number,wo?.id);
const out=[]; const info=()=>p.evaluate(()=>[...document.querySelectorAll('.q-menu')].filter(m=>m.getBoundingClientRect().width>0).map(m=>{const r=m.getBoundingClientRect(); return {role:m.getAttribute('role'),label:m.getAttribute('aria-label'),items:m.querySelectorAll('[role^=menuitem]').length,childRoles:[...new Set([...m.querySelectorAll('[role]')].map(e=>e.getAttribute('role')))].join(','),box:[r.x,r.y,r.right,r.bottom].map(Math.round),text:m.innerText.replace(/\s+/g,' ').slice(0,80)}}));
async function one(name,sel,shot){ const b=p.locator(sel).first(); if(!(await b.count())){out.push({name,missing:sel});return;} const bb=await b.boundingBox(); await b.click(); await p.waitForTimeout(1000); const m=await info(); await p.screenshot({path:`../ev/${E}-r3-${shot}.png`}); out.push({name,btn:bb&&[bb.x,bb.y,bb.x+bb.width,bb.y+bb.height].map(Math.round),menu:m}); await p.keyboard.press('Escape'); await p.waitForTimeout(500); }
await s.go(`/workorders/${wo.id}/lines`); await p.waitForTimeout(5000);
await one('WO ⋮ menu (lines tab)','[data-test-id=button_work_order_nav_bar_menu]','wo-kebab');
await one('Line: Add labor fee or discount','[data-test-id^=button_add_labor_adjustment_]','labor-adj');
await one('Profile menu','[data-test-id=profile_menu_button]','profile');
await one('Module selector','[data-test-id=module_selector_trigger]','module');
fs.writeFileSync(`../ev/${E}-r3-wo-menus2.json`,JSON.stringify({wo:wo?.number,out},null,1)); for(const o of out) console.log(JSON.stringify(o).slice(0,330));
await s.close(); process.exit(0);
