import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('../../data/prod-wo.json')); const [A,B,C]=W.lines;
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1600,height:1100}});
const rows=async tag=>{const q=await s.api('/api/work-orders/lines/'+W.wo); console.log('['+tag+']'); for(const l of q.json.data.collection) console.log('  '+l.line_name.trim().slice(0,30)+': '+l.tasks.map(t=>((t.first_name||'')+' '+(t.last_name||'')).trim()+' '+t.logged_time_decimal+'h').join(', '));};
const click=async tid=>{const b=await s.box(tid); if(!b) throw new Error('no '+tid); await s.page.mouse.click(b.x,b.y);};
const optClick=async re=>{await s.page.waitForTimeout(900); const bb=await s.page.evaluate(src=>{const re=new RegExp(src); const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>x.offsetParent&&re.test(x.innerText)); if(!e)return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText};},re.source); console.log('option',bb?.t); await s.page.mouse.click(bb.x,bb.y);};
await s.go(`/workorders/${W.wo}/lines`); await s.waitFor('button_clock_toggle_task_'+A);
// Stop
await click('button_clock_toggle_task_'+A); await s.waitFor('button_clock_out');
await s.page.locator('[data-test-id="input_tech_story"] textarea, textarea[data-test-id="input_tech_story"]').first().fill('ZZAUTOTEST SV-11253 production before').catch(e=>console.log('story',e.message));
await click('button_clock_out'); await s.page.waitForTimeout(2500); await rows('2 after Stop');
// Edit labor line 2
let b=await s.box('line_number_'+B); await s.page.mouse.click(b.x+250,b.y,{button:'right'}); await s.page.waitForTimeout(800);
await click('menu-item_edit_labor'); await s.waitFor('select_technician'); await click('select_technician');
await s.page.waitForTimeout(900); const opts=await s.page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace('check','').trim())); console.log('techs',opts.slice(0,12).join(' | '));
const other=opts.find(o=>!/Bilal/i.test(o)); await optClick(new RegExp(other.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
await s.page.keyboard.press('Escape').catch(()=>{}); await s.page.waitForTimeout(400); await click('button_save_labour'); await s.page.waitForTimeout(2500);
await rows('3 after picking '+other+' on line 2');
// Move labor line 1 -> line 2
await s.go(`/workorders/${W.wo}/lines`); await s.waitFor('line_number_'+A);
b=await s.box('line_number_'+A); await s.page.mouse.click(b.x+250,b.y,{button:'right'}); await s.page.waitForTimeout(800);
await s.page.screenshot({path:'../../ev/prod-2-context-menu.png'});
await click('menu-item_move_labor'); await s.page.waitForTimeout(1500);
console.log('dialog ids',await s.page.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.dataset.testId).join(' | ')));
fs.writeFileSync('../../data/prod-state.json',JSON.stringify({other},null,1));
await s.page.screenshot({path:'../../ev/prod-3-move-dialog-empty.png'});
await s.browser.close(); process.exit(0);
