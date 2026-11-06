import {sess} from './common.mjs'; import fs from 'fs'; const E=process.env.ENV||'staging'; const s=await sess({vp:{width:1600,height:900}}); const p=s.page;
const r=await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=5&filters[0][field]=status&filters[0][value]=in_progress&search=&showMyWorkOrders=0'); const wo=(r.json?.data?.work_orders||[])[0]; console.log('wo',wo?.number,wo?.id);
const out=[];
for(const tab of ['lines','finance']){ await s.go(`/workorders/${wo.id}/${tab}`); await p.waitForTimeout(5000);
  const cands=await p.evaluate(()=>[...document.querySelectorAll('button,[role=button]')].filter(b=>{const t=b.innerText.trim(); const r=b.getBoundingClientRect(); return r.width>0&&(/^more_vert$|^more_horiz$/.test(t)||/more|action|kebab|menu/i.test(b.getAttribute('data-test-id')||'')||/more/i.test(b.getAttribute('aria-label')||''));}).map((b,i)=>{b.setAttribute('data-probe','p'+i); const r=b.getBoundingClientRect(); return {probe:'p'+i,tid:b.getAttribute('data-test-id'),aria:b.getAttribute('aria-label'),haspopup:b.getAttribute('aria-haspopup'),box:[r.x,r.y,r.right,r.bottom].map(Math.round)};}));
  for(const c of cands.slice(0,6)){ await p.click(`[data-probe=${c.probe}]`).catch(()=>{}); await p.waitForTimeout(900);
    const m=await p.evaluate(()=>[...document.querySelectorAll('.q-menu')].filter(m=>m.getBoundingClientRect().width>0).map(m=>({role:m.getAttribute('role'),label:m.getAttribute('aria-label'),items:m.querySelectorAll('[role^=menuitem]').length,text:m.innerText.replace(/\s+/g,' ').slice(0,80)})));
    if(m.length) await p.screenshot({path:`../ev/${E}-r3-wo-${tab}-${c.probe}.png`}); out.push({tab,...c,menu:m}); await p.keyboard.press('Escape'); await p.waitForTimeout(500); } }
fs.writeFileSync(`../ev/${E}-r3-wo-menus.json`,JSON.stringify(out,null,1)); for(const o of out) console.log(JSON.stringify(o).slice(0,300));
await s.close(); process.exit(0);
