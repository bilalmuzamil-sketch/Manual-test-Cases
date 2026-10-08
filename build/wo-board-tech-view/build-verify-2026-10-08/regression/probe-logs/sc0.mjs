import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('sc0'); const b=await start('/schedule','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1800,height:1100}); await page.waitForTimeout(3000);
 for(let i=0;i<15;i++){ await page.mouse.move(400,700); await page.mouse.wheel(0,800); await page.waitForTimeout(500); }
 const t=await body(); log('HAS ZZ',(t.match(/ZZAUTOTEST \w+ \w+/g)||[]).join(','), 'Tech ShopView',t.includes('Tech ShopView'),'Admin ShopView',t.includes('Admin ShopView'));
 log('DEPTS',(t.match(/\b[A-Z]{4,}( [A-Z]+)*\b/g)||[]).filter(x=>!/AM|PM/.test(x)).slice(0,30).join('|'));
 const names=await page.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/6:00 AM – 5:00 PM|AM – |PM – /.test(e.innerText||'')).length); log('rows w hours',names);
 await dump('SC0-schedule-scrolled');
 await page.getByPlaceholder('Search work orders').fill(st().woE.num); await page.waitForTimeout(3500); log('LIST after search',(await body()).match(/Filters (.{0,200})/)?.[1]);
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
