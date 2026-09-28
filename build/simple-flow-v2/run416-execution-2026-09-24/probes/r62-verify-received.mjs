// Read the receive back (Rule 107: read the restore/write back). My keyword filter found no rows
// afterwards, which could mean the part moved to a state my filter does not name - so list EVERY
// part row unfiltered and say what it reads.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const R={};
for (const [tag,id] of [['S2-908','068f9856-9d28-4500-a3dd-dd6d7aafb15a']]) {
  await openWo(page,id); await page.waitForTimeout(9000);
  const st=await page.evaluate(()=>{
    const onWO=!!([...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||'')));
    const lineIds=[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean);
    return { onWO,
      lines:lineIds.map(id=>{const r=document.querySelector('tr.line-row-'+id);
        return {badges:[...r.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()).join('+'),
                buttons:[...r.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').trim()).filter(Boolean)};}),
      everyRow:[...document.querySelectorAll('tr')].filter(t=>t.getBoundingClientRect().height)
        .map(t=>(t.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).map(t=>t.slice(0,120)) };});
  R[tag]=st;
  console.log('###',tag,'| on the work order:',st.onWO);
  console.log('  lines:'); st.lines.forEach(l=>console.log('     ',l.badges,'->',JSON.stringify(l.buttons)));
  console.log('  every row on the page:');
  st.everyRow.forEach(r=>console.log('     ',r));
  await page.screenshot({path:`${EV}/r62-${tag}.png`,fullPage:true}).catch(()=>{});
}
fs.writeFileSync(`${EV}/r62-verify-received.json`,JSON.stringify(R,null,1));
await browser.close();
