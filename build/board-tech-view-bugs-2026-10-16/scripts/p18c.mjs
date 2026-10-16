import {session,toView,dens} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1920,height:1000},dpr:2}); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000);
const q='S2-33351'; const out={};
const tip=async(sel)=>{ const loc=p.locator(sel).first(); const b=await loc.boundingBox(); if(!b) return null; await p.mouse.move(b.x+b.width/2,b.y+b.height/2); await p.waitForTimeout(1500); const t=await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(e=>e.innerText.trim()).join(' / ')); await p.mouse.move(1900,980); await p.waitForTimeout(600); return {t,b}; };
for(const v of ['list','tech_view']){ await toView(p,v); 
  if(v==='tech_view'){ const ex=await p.getAttribute('[data-test-id=button_tech_view_group_toggle_unassigned]','aria-expanded'); out.ex=ex; }
  await p.click('[data-test-id=page_search_toggle]').catch(()=>{}); await p.waitForTimeout(500); await p.keyboard.press('Control+A'); await p.keyboard.type(q,{delay:30}); await p.waitForTimeout(4000);
  if(v==='tech_view'){ // expand all groups containing it
    for(const b of await p.$$('[data-test-id^=button_tech_view_group_toggle_]')){ if(await b.getAttribute('aria-expanded')!=='true'){ await b.click(); await p.waitForTimeout(800);} } await p.waitForTimeout(2000);}
  const scope= v==='list'? 'td.cell.status' : '[data-test-id^=tech_view_row_]';
  out[v]=await p.evaluate(sc=>[...document.querySelectorAll(sc)].map(c=>({pill:c.querySelector('.q-badge:not(.q-badge--floating)')?.innerText.trim(),f:[...c.querySelectorAll('.q-badge--floating')].map(f=>f.innerText.trim()+' '+getComputedStyle(f).backgroundColor)})).filter(x=>x.pill),scope);
  out[v+'_tips']=[]; for(let i=0;i<2;i++){ out[v+'_tips'].push(await tip(`${scope} .q-badge--floating >> nth=${i}`)); }
  await p.screenshot({path:`/tmp/qa11310/p18c-${v}.png`}); console.log(v,JSON.stringify(out[v]),JSON.stringify(out[v+'_tips'].map(x=>x&&x.t)));
}
fs.writeFileSync('/tmp/qa11310/p18c.json',JSON.stringify(out,null,1)); await s.close();
