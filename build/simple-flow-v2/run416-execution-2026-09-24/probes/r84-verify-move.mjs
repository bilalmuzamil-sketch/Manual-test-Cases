// Verify the move landed. My earlier grouping was wrong: Story and Labour rows also carry the
// line-row class, so "the part's line" was being attributed to a Labour row. Group by the NUMBERED
// line rows only - the ones that read "expand_less N more_vert <name>".
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
await openWo(page,WO); await page.waitForTimeout(9000);
const R=await page.evaluate(()=>{
  const out=[]; let cur='(before any line)';
  for(const tr of document.querySelectorAll('tr')){
    const t=(tr.innerText||'').replace(/\s+/g,' ').trim();
    if(/^expand_(less|more)\s+\d+\s+more_vert/.test(t)){ cur=t.replace(/^expand_\w+\s+/,'').slice(0,40); out.push({line:cur,parts:[]}); continue; }
    if(/drag_indicator/.test(t) && out.length){ out[out.length-1].parts.push(t.slice(0,70)); }
  }
  return out;});
console.log('the work order, line by line:');
R.forEach(l=>{ console.log('\n  LINE:',l.line);
  if(!l.parts.length) console.log('     (no parts)');
  l.parts.forEach(p=>console.log('     -',p)); });
const decline=R.find(l=>/decline line/i.test(l.line));
console.log('\n>>> the line I moved a part TO now holds',decline?decline.parts.length:0,'part(s)');
if(decline) decline.parts.forEach(p=>console.log('    ',p));
fs.writeFileSync(`${EV}/r84-verify-move.json`,JSON.stringify(R,null,1));
await browser.close();
