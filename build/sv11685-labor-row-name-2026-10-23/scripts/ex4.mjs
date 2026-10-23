import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:2});
const p=s.page; const R=sel=>p.evaluate(s=>{const e=typeof s==='string'?document.querySelector(s):null; if(!e)return null; const r=e.getBoundingClientRect(); return [r.x,r.y,r.width,r.height]},sel);
await s.go('/workorders/b94d839f-0d91-4fdd-bf00-26fdd3d557ac/lines'); await p.waitForTimeout(6000);
const kid='button_add_labor_adjustment_522f44cc-8a19-4501-8c7e-2f1bea2d0da7'; const kb=await R(`[data-test-id="${kid}"]`);
await p.mouse.click(kb[0]+kb[2]/2,kb[1]+kb[3]/2); await p.waitForTimeout(1200);
const item=await p.evaluate(()=>{const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>/Add Labor Fee/.test(x.innerText)); const r=e.getBoundingClientRect(); return {t:e.innerText.trim(),id:e.getAttribute('data-test-id'),b:[r.x,r.y,r.width,r.height]};});
await p.mouse.move(200,900); await p.screenshot({path:'/tmp/qa11685/w/fee-1-menu.png'});
await p.mouse.click(item.b[0]+item.b[2]/2,item.b[1]+item.b[3]/2); await p.waitForTimeout(2500);
const dl={card:await R('.q-dialog .q-card'),banner:await R('[data-test-id=banner_adjustment_mapping_guard]'),add:await R('[data-test-id=button_add_adjustment]'),
  text:await p.evaluate(()=>document.querySelector('[data-test-id=banner_adjustment_mapping_guard]')?.innerText.trim()),title:await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText.split('\n')[0]),
  disabled:await p.evaluate(()=>{const a=document.querySelector('[data-test-id=button_add_adjustment]'); return a&&(a.disabled||a.classList.contains('disabled')||a.getAttribute('aria-disabled'))})};
await p.screenshot({path:'/tmp/qa11685/w/fee-2-dialog.png'});
fs.writeFileSync('/tmp/qa11685/w/fee-boxes.json',JSON.stringify({kebab:kb,item,...dl})); console.log(JSON.stringify({item:item.t,id:item.id,...dl}));
process.exit(0);
