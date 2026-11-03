import {prod} from '../common.mjs'; import fs from 'fs'; const WO=process.argv[2]; const s=await prod('/tmp/qa71'); const p=s.page; const R={marker:await s.marker()}; let n=10;
const shot=async t=>{n++; await p.screenshot({path:`sv10130/${n}-${t}.png`});};
const read=()=>p.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop(); if(!d) return null; return {title:d.querySelector('.q-card__section,.text-h6,[data-test-id="dialog_title"]')?.innerText?.trim(),
  fields:[...d.querySelectorAll('.q-field')].map(f=>({label:(f.querySelector('.q-field__label')?.innerText||'').trim(),ph:[...f.querySelectorAll('input,textarea')].map(i=>i.getAttribute('placeholder')).join('|'),val:[...f.querySelectorAll('input,textarea')].map(i=>i.value).join('|').slice(0,60),err:(f.querySelector('.q-field__messages')?.innerText||'').trim()})).filter(f=>f.label).slice(0,4)};});
const openNew=async()=>{ await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(5000); if(!(await read())){ await p.click('text=New Line'); await p.waitForTimeout(1500);} };
// A: empty save, then pick a canned line, wait, blur -> does the error clear?
await openNew(); await p.click('[data-test-id="button_save_close"]'); await p.waitForTimeout(1200); R.a_empty=await read();
await p.click('[data-test-id="select_line_canned_line"]'); await p.waitForTimeout(1200); await p.locator('.q-menu .q-item').nth(2).click(); await p.waitForTimeout(3000);
await p.mouse.click(1000,330); await p.waitForTimeout(1500); R.a_picked_blur=await read(); await shot('picked-after-wait-blur');
// B: 256 chars typed into Title, and Description typed
await openNew(); await p.click('[data-test-id="select_line_canned_line"]'); await p.keyboard.type('A'.repeat(256)); await p.waitForTimeout(1000);
const ds=p.locator('.q-dialog [data-test-id="input_line_description"]').first(); await ds.click(); await p.keyboard.type('typed description'); await p.waitForTimeout(800);
R.b_256=await read(); await shot('title-256-and-description');
await p.click('[data-test-id="button_save_close"]'); await p.waitForTimeout(1500); R.b_256_save=await read(); R.b_toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(x=>x.innerText.replace(/\s+/g,' ')));
// 255 chars is accepted message-free?
await p.click('[data-test-id="select_line_canned_line"]'); await p.keyboard.press('End'); await p.keyboard.press('Backspace'); await p.waitForTimeout(800); R.b_255=await read();
// C: Edit Line on the saved line
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(5000);
R.c_ids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(x=>/edit|line_menu|context|kebab|name/i.test(x)).slice(0,20));
fs.writeFileSync('sv10130/result2.json',JSON.stringify(R,null,1)); console.log(JSON.stringify(R,null,1).slice(0,5000)); await s.close(); process.exit(0);
