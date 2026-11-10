// SV-12405 regressions on the Finance tab: fresh open, Customer PO edit, two quick PO edits, invoice date change.
// For each: preview render requests (POST work-orders/invoices/estimate), max in flight at once, and what the preview shows at the end.
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch', WO=process.env.WO, TAG=process.env.TAG||ENV+'-reg';
const s=await sess(); const p=s.page; const t0=Date.now(); const T=()=>(Date.now()-t0)/1000;
let reqs=[]; const live=new Map();
p.on('request',r=>{ if(/\/api\/work-orders\/invoices\/estimate/.test(r.url())){ const o={start:T(),end:null}; live.set(r,o); reqs.push(o);} });
const done=r=>{ const o=live.get(r); if(o&&o.end===null) o.end=T(); }; p.on('requestfinished',done); p.on('requestfailed',done);
const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,120)));
const out=['marker '+JSON.stringify(await s.marker())];
const stat=(tc)=>{ const a=reqs.filter(o=>o.start>=tc); let m=0; for(const x of a){ m=Math.max(m,a.filter(b=>b.start<=x.start&&(b.end===null||b.end>x.start)).length);} return `estimateReqs=${a.length} maxAtOnce=${m}`; };
const txt=async re=>p.evaluate(r=>((document.body.innerText.match(new RegExp(r))||['(not found)'])[0]).replace(/\s+/g,' '),re);
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(2500);
let tc=T(); await s.glideClick('link_finance_tab'); await p.waitForTimeout(9000);
out.push(`open Finance: ${stat(tc)} preview="${await txt('(Invoice|Estimate):?\\s*(INV|EST)?-?[A-Z0-9-]+')}"`); await p.screenshot({path:`../ev/${TAG}-1-open.png`});
const po=async v=>{ const inp=p.locator('input[aria-label="Customer PO"]').first(); const b=await inp.boundingBox(); await p.mouse.click(b.x+b.width/2,b.y+b.height/2); await p.keyboard.press('Control+A'); await p.keyboard.type(v,{delay:30}); await p.mouse.click(800,1000); };
const v1='ZZ12405-A'+(Date.now()%10000); tc=T(); await po(v1); await p.waitForTimeout(9000);
out.push(`PO edit to ${v1}: ${stat(tc)} preview shows PO: "${await txt(v1)}"`); await p.screenshot({path:`../ev/${TAG}-2-po.png`});
const v2='ZZ12405-B'+(Date.now()%10000), v3='ZZ12405-C'+(Date.now()%10000); tc=T(); await po(v2); await p.waitForTimeout(300); await po(v3); await p.waitForTimeout(10000);
out.push(`two quick PO edits ${v2} then ${v3}: ${stat(tc)} preview shows latest: "${await txt(v3)}" stale shown: "${await txt(v2)}"`); await p.screenshot({path:`../ev/${TAG}-3-po-twice.png`});
const d=p.locator('[data-test-id=date_input_invoice_date]'); tc=T(); await d.click(); await p.keyboard.press('Control+A'); await p.keyboard.type(process.env.DATE||'11/12/2026',{delay:40}); await p.keyboard.press('Tab'); await p.waitForTimeout(9000);
out.push(`invoice date change: ${stat(tc)} preview="${await txt('Invoice date:?\\s*[A-Z][a-z]{2} \\d+, \\d{4}')}"`); await p.screenshot({path:`../ev/${TAG}-4-date.png`});
out.push('pageerrors '+JSON.stringify(errs)); out.push('marker-end '+JSON.stringify(await s.marker()));
console.log(out.join('\n')); fs.writeFileSync(`../ev/${TAG}-log.txt`,out.join('\n')+'\n'); await s.close(); process.exit(0);
