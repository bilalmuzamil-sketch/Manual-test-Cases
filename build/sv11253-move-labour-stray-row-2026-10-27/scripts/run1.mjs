import {sess} from './lib.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('../data/wo1.json')); const [A,B,C]=W.lines; const log=[];
const snap=async(s,tag)=>{const r=await s.rows(W.wo); const t=r.map(l=>`${l.line.trim()}: ${l.tasks.map(x=>x.name+' '+x.time+'h').join(', ')}`); console.log('['+tag+']\n  '+t.join('\n  ')); log.push({tag,rows:r});};
const click=async(s,tid)=>{const b=await s.box(tid); if(!b) throw new Error('no '+tid); await s.page.mouse.click(b.x,b.y);};
// 1 tech stops
const t=await sess('tech'); await t.go(`/workorders/${W.wo}/lines`); await t.waitFor('button_clock_toggle_task_'+A);
await click(t,'button_clock_toggle_task_'+A); await t.waitFor('button_clock_out');
await t.page.fill('[data-test-id="input_tech_story"] textarea, [data-test-id="input_tech_story"] input, textarea[data-test-id="input_tech_story"]','ZZAUTOTEST SV-11253 work on line 1').catch(e=>console.log('story fill',e.message));
await click(t,'button_clock_out'); await t.page.waitForTimeout(2500); console.log(t.writes.filter(w=>/check-out|tech/.test(w)).join('\n')); await t.browser.close();
const s=await sess(); await snap(s,'1 after Start+Stop on line 1');
// 2 Edit labor on line 2: David Combs
await s.go(`/workorders/${W.wo}/lines`); await s.waitFor('line_number_'+B);
let b=await s.box('line_number_'+B); await s.page.mouse.click(b.x+250,b.y,{button:'right'}); await s.page.waitForTimeout(800);
await click(s,'menu-item_edit_labor'); await s.waitFor('select_technician'); await click(s,'select_technician'); await s.page.waitForTimeout(1000);
await s.page.locator('.q-menu .q-item').filter({hasText:'David Combs'}).first().click(); await s.page.keyboard.press('Escape').catch(()=>{});
await s.page.waitForTimeout(500); await click(s,'button_save_labour'); await s.page.waitForTimeout(2500);
await snap(s,'2 after picking David Combs on line 2');
// 3 Move labor from line 1 to line 2
await s.go(`/workorders/${W.wo}/lines`); await s.waitFor('line_number_'+A);
b=await s.box('line_number_'+A); await s.page.mouse.click(b.x+250,b.y,{button:'right'}); await s.page.waitForTimeout(800);
console.log('menu has move:',!!(await s.box('menu-item_move_labor'))); await click(s,'menu-item_move_labor'); await s.page.waitForTimeout(1500);
console.log('dialog:',await s.page.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.dataset.testId).join(' | ')));
await s.page.screenshot({path:'../ev/raw-3a-move-dialog.png'});
fs.writeFileSync('../data/run1-log.json',JSON.stringify(log,null,1)); console.log(s.writes.join('\n'));
await s.browser.close(); process.exit(0);
