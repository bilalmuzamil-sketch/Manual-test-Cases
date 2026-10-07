import {ob,j} from './lib.mjs';
const [tag,pn,id]=process.argv.slice(2); const s=await ob({dpr:2}); const p=s.page;
await s.go('/parts/inventory'); await p.waitForTimeout(2500);
let b=await s.box('page_search_toggle'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(800); await p.keyboard.type(pn,{delay:60}); await p.waitForTimeout(3000);
const g=await p.evaluate(id=>{const e=document.querySelector(`[data-test-id="stock_quantity_badge_${id}"]`); const n=document.querySelector(`[data-test-id="table_cell_name_${id}"]`); const r=e.getBoundingClientRect(), rn=n.getBoundingClientRect(); return {badge:e.innerText.trim(),bx:Math.round(r.x),by:Math.round(r.y),bw:Math.round(r.width),bh:Math.round(r.height),nx:Math.round(rn.x),ny:Math.round(rn.y)};},id);
console.log(tag,j(g)); await p.screenshot({path:`raw/badge-${tag}.png`}); require_fs(tag,g);
function require_fs(t,g){ import('fs').then(fs=>fs.writeFileSync(`raw/badge-${t}.json`,JSON.stringify(g))); }
await p.waitForTimeout(300); await s.close();
