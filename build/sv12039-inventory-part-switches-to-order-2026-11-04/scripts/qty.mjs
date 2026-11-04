// usage: [ENV=prod] WOJ=<wo json> PN=<pn> PID=<inventory part id> QTYS="1,2,7,8" TAG=<tag> node qty.mjs
import {sess} from './common.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync(process.env.WOJ||'/tmp/sv12039/wo-explore.json','utf8')); const PN=process.env.PN; const PID=process.env.PID; const OUT='ev/'+process.env.TAG; fs.mkdirSync(OUT,{recursive:true});
const QTYS=(process.env.QTYS||'1,2').split(',');
const s=await sess(); const p=s.page; const R={marker:await s.marker(),pn:PN,steps:[]};
await s.go(`/workorders/${W.wo}/lines`); await p.waitForTimeout(6000);
await p.click('[data-test-id="button_add_part"]'); await p.waitForTimeout(1500);
await p.keyboard.type(PN,{delay:60}); await p.waitForTimeout(3500);
const row=()=>p.evaluate(()=>{const r=document.querySelector('[data-test-id="inline_part_row"]'); const lg=document.querySelector('[data-test-id="inline_part_row_legend"]'); const v=id=>{const e=document.querySelector(`[data-test-id="${id}"]`); if(!e) return null; const i=e.matches('input')?e:e.querySelector('input'); return i?i.value:e.innerText.trim();};
  return {row:r?r.innerText.replace(/\s+/g,' ').trim():null,legend:lg?lg.innerText.replace(/\s+/g,' ').trim():null,pn:v('select_inline_part_number'),desc:v('input_inline_part_description'),qty:v('input_inline_part_quantity'),cat:v('select_inline_part_category'),cost:v('input_inline_part_cost'),sell:v('input_inline_part_sell_price'),
   chips:[...(r?.querySelectorAll('.q-chip,.q-badge,[class*=badge],[class*=chip]')||[])].map(c=>c.innerText.trim()).filter(Boolean)};});
await p.click(`[data-test-id="select_option_workorder_part_${PID}-inventory_part"]`); await p.waitForTimeout(2000);
R.steps.push({after:'pick inventory option',...await row()}); await p.screenshot({path:OUT+'/1-picked-inventory.png'});
for(const q of QTYS){ const qi=p.locator('[data-test-id="input_inline_part_quantity"] input, input[data-test-id="input_inline_part_quantity"]').first(); await qi.click(); await p.keyboard.press('Control+A'); await p.keyboard.type(q,{delay:80}); await p.waitForTimeout(1500);
  R.steps.push({after:'type qty '+q,...await row()}); await p.screenshot({path:`${OUT}/2-qty-${q}.png`});
  await p.keyboard.press('Tab'); await p.waitForTimeout(1500); R.steps.push({after:'tab out qty '+q,...await row()}); await p.screenshot({path:`${OUT}/3-qty-${q}-blur.png`}); }
fs.writeFileSync(OUT+'/result.json',JSON.stringify(R,null,1)); for(const st of R.steps) console.log(JSON.stringify(st).slice(0,600));
await s.close(); process.exit(0);
