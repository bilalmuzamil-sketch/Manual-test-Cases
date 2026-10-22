import {C} from './stlib.mjs'; import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const R={}; const s=await open({env:'staging',dir:'/tmp/qa21',cookies:C,quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page;
await s.go('/workorders'); await p.waitForTimeout(6000);
const info=()=>p.evaluate(()=>{const rc=e=>{const r=e.getBoundingClientRect();return {x:+r.x.toFixed(1),y:+r.y.toFixed(1),w:+r.width.toFixed(1),h:+r.height.toFixed(1)}};
 const b=[...document.querySelectorAll('[data-test-id=badge_display_option_new]')].filter(e=>e.getBoundingClientRect().width);
 const sel=[...document.querySelectorAll('[data-test-id^=display_option_]')].map(e=>[e.getAttribute('data-test-id'),/selected|active|--on|is-active/.test(e.className)||e.getAttribute('aria-pressed')==='true'||e.getAttribute('aria-selected')==='true']);
 return {url:location.pathname+location.search,pills:b.length,pill:b[0]&&rc(b[0]),sw:rc(document.querySelector('[data-test-id=toggle_display_option]')),sel:sel.filter(x=>x[1]).map(x=>x[0]),
  boardCols:!!document.querySelector('[data-test-id^=board_column_]'),techGroups:!!document.querySelector('[data-test-id^=tech_view_group_]'),table:!!document.querySelector('table, .q-table')}});
R.initial=await info(); console.log('initial',JSON.stringify(R.initial));
for(const W of [1440,1024]){ await p.setViewportSize({width:W,height:W===1440?900:768}); await s.go('/workorders'); await p.waitForTimeout(4000);
 for(const v of ['list','tech_view','board_view','tech_view','list']){
  const b=await p.$('[data-test-id=display_option_'+v+']'); const bb=await b.boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(4500);
  const i=await info(); R[W+'-'+v]=i; console.log(W,v,JSON.stringify(i));
  await p.screenshot({path:`/tmp/qa21/v636-${W}-${v}.png`});
 }
}
// tooltip on Tech View at 1440
await p.setViewportSize({width:1440,height:900}); await s.go('/workorders'); await p.waitForTimeout(4000);
const tv=await p.$('[data-test-id=display_option_tech_view]'); const tb=await tv.boundingBox(); await p.mouse.move(tb.x+tb.width/2,tb.y+tb.height/2); await p.waitForTimeout(1800);
R.tooltip=await p.evaluate(()=>{const rc=e=>{const r=e.getBoundingClientRect();return {x:+r.x.toFixed(1),y:+r.y.toFixed(1),w:+r.width.toFixed(1),h:+r.height.toFixed(1)}};const t=[...document.querySelectorAll('.q-tooltip')].filter(e=>e.getBoundingClientRect().width);const b=document.querySelector('[data-test-id=badge_display_option_new]');return {tips:t.map(e=>({txt:e.innerText.trim(),rect:rc(e)})),pill:rc(b)}});
console.log('tooltip',JSON.stringify(R.tooltip)); await p.screenshot({path:'/tmp/qa21/v636-tooltip.png'});
// keyboard focus on Tech View
await p.mouse.move(10,400); await p.keyboard.press('Tab'); 
// restore initial view
const back=R.initial.sel[0]||'display_option_board_view'; const bk=await p.$('[data-test-id='+back+']'); const bkb=await bk.boundingBox(); await p.mouse.click(bkb.x+bkb.width/2,bkb.y+bkb.height/2); await p.waitForTimeout(3000);
fs.writeFileSync('/tmp/qa21/v636.json',JSON.stringify(R,null,1)); await s.close();
