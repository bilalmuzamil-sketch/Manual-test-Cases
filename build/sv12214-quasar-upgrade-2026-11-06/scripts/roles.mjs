import {sess} from './common.mjs'; import fs from 'fs'; const E=process.env.ENV||'staging'; const s=await sess({vp:{width:1600,height:900}}); const p=s.page; const R=[];
const pop=()=>p.evaluate(()=>[...document.querySelectorAll('.q-menu')].filter(m=>m.getBoundingClientRect().width>0).map(m=>{const r=m.getBoundingClientRect(); return {role:m.getAttribute('role'),label:m.getAttribute('aria-label'),box:[r.x,r.y,r.right,r.bottom].map(Math.round),items:m.querySelectorAll('[role^=menuitem]').length,text:m.innerText.replace(/\s+/g,' ').slice(0,90)}}));
async function probe(name,sel,shot){ const b=p.locator(sel).first(); if(!(await b.count())){ R.push({name,missing:sel}); return; }
  const btn=await b.evaluate(e=>{const c=e.closest('[aria-haspopup]')||e; const r=e.getBoundingClientRect(); return {haspopup:c.getAttribute('aria-haspopup'),box:[r.x,r.y,r.right,r.bottom].map(Math.round)}});
  await b.click(); await p.waitForTimeout(1000); const m=await pop(); if(shot) await p.screenshot({path:`../ev/${E}-r3-${shot}.png`});
  R.push({name,btn,menu:m}); await p.keyboard.press('Escape'); await p.waitForTimeout(600); }
await s.go('/workorders'); await p.waitForTimeout(4000); await p.click('[data-test-id=display_option_list]').catch(()=>{}); await p.waitForTimeout(2500);
await probe('WO list: Columns','[data-test-id=button_column_selection]','columns');
await probe('WO list: Status filter','[data-test-id=filter_chip_status]','status');
const chips=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=filter_chip_]')].map(e=>e.getAttribute('data-test-id'))); R.push({chips});
for(const c of chips.filter(c=>c!=='filter_chip_status')) await probe('WO list chip: '+c,`[data-test-id=${c}]`);
const rowBtn=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).find(x=>/(more|actions|kebab|menu)/i.test(x)&&/row|work_order|wo_/i.test(x))); R.push({rowBtn}); if(rowBtn) await probe('WO list: row … menu',`[data-test-id="${rowBtn}"]`,'rowmenu');
const more=await p.evaluate(()=>[...document.querySelectorAll('button,[role=button]')].filter(e=>/more actions/i.test(e.getAttribute('aria-label')||'')||/more_actions/i.test(e.getAttribute('data-test-id')||'')).map(e=>e.getAttribute('data-test-id')||e.getAttribute('aria-label'))); R.push({moreActions:more});
await p.click('[data-test-id=display_option_tech_view]').catch(()=>{}); await p.waitForTimeout(3000); await probe('Tech View: Density','[data-test-id=button_density]','density');
await p.click('[data-test-id=display_option_board_view]').catch(()=>{}); await p.waitForTimeout(3500); await probe('Board: Card size','[data-test-id=button_card_size]','cardsize');
await s.go('/schedule'); await p.waitForTimeout(5000);
await probe('Schedule: Filter & display','[data-test-id=schedule_filter_display_menu]','sched-filter');
await probe('Schedule: View options','[data-test-id=schedule_view_options_menu]','sched-view');
await s.go('/reports/punch-clock-activities'); await p.waitForTimeout(4500);
await probe('Timesheet Activities: Date Range','[data-test-id=filter_chip_range]','daterange');
fs.writeFileSync(`../ev/${E}-r3-roles.json`,JSON.stringify(R,null,1));
for(const r of R) console.log(JSON.stringify(r).slice(0,330));
await s.close(); process.exit(0);
