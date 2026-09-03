// "Receive Credit" is a PAGE, not a dialog: /parts/confirm-return?ids=<returnId>&isManualReturn=0
// Read every field on it - this is where a restocking fee would be entered if one exists.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/invoice-ui-refresh/seed-2026-09-03';
const ID = process.env.RID || '815458cf-c3b5-4393-a54f-44f9e469bc48';
const { browser, page, APP, APIH } = await boot('sv8218', `/parts/confirm-return?ids=${ID}&isManualReturn=0`, 'admin');
await page.waitForTimeout(11000);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const d = await page.evaluate(L=>{ const lab=eval(L); const main=document.querySelector('.q-page')||document.body;
  return { text: lab(main).slice(0,900),
    inputs:[...main.querySelectorAll('input,textarea')].map((i,k)=>{ i.setAttribute('data-qa-in',String(k));
      let p=i.parentElement,ctx=''; for(let dd=0;dd<7&&p;dd++,p=p.parentElement){const t=lab(p); if(t.length>=3&&t.length<=90){ctx=t;break;}}
      return {k, value:i.value, ctx};}),
    buttons:[...new Set([...main.querySelectorAll('button,.q-btn')].map(lab).filter(x=>x&&x.length<40))],
    tables:[...main.querySelectorAll('table')].map(tb=>({h:[...tb.querySelectorAll('thead th')].map(lab),
      r:[...tb.querySelectorAll('tbody tr')].map(tr=>[...tr.cells].map(lab))})) }; }, lab);
console.log(JSON.stringify(d,null,1).slice(0,3000));
await page.screenshot({path:`${OUT}/confirm-return.png`, fullPage:true});
fs.writeFileSync(`${OUT}/confirm-return.json`, JSON.stringify(d,null,1));
await browser.close();
