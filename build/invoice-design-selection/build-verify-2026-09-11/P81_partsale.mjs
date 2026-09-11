// C53543, the two missing documents: Parts Sale Estimate and Parts Sale Credit.
// Render them from the screen itself under both designs, guarded.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={guardDiscards:[]}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P81.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/','admin'); const page=s.page;
await page.setViewportSize({width:1700,height:1200});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const api=(m,p,b)=>page.evaluate(async({a,m,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',body:b?JSON.stringify(b):undefined});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t};},{a:API,m,p,b:b||null});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results','partSales']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const stored=async()=>{const r=await api('GET','/api/organizations/invoice-settings/view');
  const d=(r.json&&(r.json.data||r.json))||{}; return d.documentDesign||null;};
const setDesign=async(w)=>{ if((await stored())===w) return w;
  await api('POST','/api/organizations/invoice-settings/change-design',{documentDesign:w}); return await stored(); };
await page.waitForTimeout(9000);
R.found=await stored(); log('design as found: %s', R.found);

// --- the part sales landscape here
const ps=rowsOf((await api('GET','/api/part-sales?pagination[page]=1&pagination[rowsPerPage]=200')).json);
R.statuses=ps.reduce((a,p)=>{a[p.status]=(a[p.status]||0)+1;return a;},{});
log('part sales: %d %s', ps.length, JSON.stringify(R.statuses));
const est=ps.find(p=>p.status==='estimate');
R.estimate=est?{num:est.number,id:est.id}:null;
log('parts sale ESTIMATE candidate: %s', JSON.stringify(R.estimate));
// any part sale credits? look for negative totals or a credit flag
const credish=ps.filter(p=>/credit/i.test(String(p.status))||Number(p.totalPrice)<0);
R.creditCandidates=credish.slice(0,5).map(p=>({n:p.number,st:p.status,t:p.totalPrice}));
log('parts sale CREDIT candidates: %s', JSON.stringify(R.creditCandidates));
save();

// --- render the parts sale estimate from its own Finance tab, under each design
if(est){
  R.renders={};
  for(const want of ['legacy','modern']){
    const now=await setDesign(want);
    if(now!==want){ log('could not set %s', want); continue; }
    const a=await stored();
    await page.goto(`${APP}/parts/part-sale/${est.id}/finance`,{waitUntil:'domcontentloaded',timeout:90000});
    await page.waitForTimeout(16000);
    // the document is rendered into the page (or an iframe) -- take whichever holds it
    const doc=await page.evaluate(()=>{
      const fr=[...document.querySelectorAll('iframe')];
      for(const f of fr){ try{ const d=f.contentDocument; if(d && (d.body.innerText||'').length>200)
        return {from:'iframe', html:d.body.innerHTML, text:(d.body.innerText||'').replace(/\s+/g,' ')}; }catch(e){} }
      const c=document.querySelector('.invoice-preview,.document-preview,[class*=preview]')||document.body;
      return {from:'page', html:c.innerHTML, text:(c.innerText||'').replace(/\s+/g,' ')};
    });
    const b=await stored();
    if(a!==b){ R.guardDiscards.push({want,before:a,after:b}); log('DISCARDED %s', want); continue; }
    R.renders[want]={design:a, from:doc.from, len:doc.html.length, textLen:doc.text.length,
      caps:/SCOPE OF WORK|BILL TO|REMIT PAYMENT TO|SUMMARY/.test(doc.text),
      sentence:/Bill To|Remit payment to|Line Total/.test(doc.text),
      money:(doc.text.match(/\$[\d,]+\.\d{2}/g)||[]).sort(),
      docNo:(doc.text.match(/\b(?:INV|EST|P)-?[A-Z0-9-]+/)||[])[0]||null,
      head:doc.text.slice(0,260)};
    fs.writeFileSync(`${DIR}/evidence/P81-${want}-partsale-estimate.html`, doc.html);
    await page.screenshot({path:`${DIR}/evidence/P81-${want}-partsale-estimate.png`, fullPage:false});
    log('  parts sale estimate %s under %s: from=%s htmlLen=%d caps=%s', est.number, want, doc.from, doc.html.length, R.renders[want].caps);
    log('     head: %s', R.renders[want].head.slice(0,200));
    save();
  }
  const L=R.renders.legacy, M=R.renders.modern;
  if(L&&M){ R.verdict={legacyLen:L.len, modernLen:M.len, differs:L.len!==M.len,
    capsL:L.caps, capsM:M.caps, docNoSame:L.docNo===M.docNo,
    moneyOnlyL:L.money.filter(x=>!M.money.includes(x)), moneyOnlyM:M.money.filter(x=>!L.money.includes(x))};
    log('PARTS SALE ESTIMATE VERDICT %s', JSON.stringify(R.verdict)); }
}
R.restored=await setDesign(R.found); log('restored to: %s', R.restored);
save(); log('done'); await s.browser.close(); process.exit(0);
