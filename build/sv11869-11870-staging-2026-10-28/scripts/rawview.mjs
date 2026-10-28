// Shows the downloaded file as plain text in a browser tab (what a text editor shows), screenshots it, and records the
// exact on-screen boxes of the line texts we check (Range.getBoundingClientRect).
import pkg from '/opt/node22/lib/node_modules/playwright/index.js'; const {chromium}=pkg; import fs from 'fs';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1500,height:360},deviceScaleFactor:2});
await p.goto('file:///tmp/qa30/customer_invoice.txt'); await p.addStyleTag({content:'pre{font-size:13px;line-height:20px;margin:8px}'});
const needles=["'+Top up coolant","'=Replace hose","'-A12: Hose clamp","'\tTab start","\"ZZ Tab line","'@Alignment","'-Brake check","\"Rotate tires","\"'\r","\"Replace = hose","'-10% fleet","-2.50,-2.50"];
const boxes=await p.evaluate(nd=>{ const pre=document.querySelector('pre'); const t=pre.firstChild; const txt=t.textContent; const out={};
  for(const n of nd){ const i=txt.indexOf(n); if(i<0){out[n]=null;continue;} const r=document.createRange(); r.setStart(t,i); r.setEnd(t,i+n.replace(/\r/,'').length+ (n.includes('\r')?1:0)); const rs=[...r.getClientRects()]; const a=rs[0]; out[n]=[a.x,a.y,a.x+a.width,a.y+a.height]; } const j=txt.indexOf('CR start'); const k=txt.lastIndexOf("'",j); const r1=document.createRange(); r1.setStart(t,k); r1.setEnd(t,k+1); const a1=r1.getClientRects()[0]; out.crQuote=[a1.x,a1.y,a1.x+a1.width,a1.y+a1.height];
  const r2=document.createRange(); r2.setStart(t,j); r2.setEnd(t,j+'CR start - carriage return'.length); const a2=r2.getClientRects()[0]; out.crText=[a2.x,a2.y,a2.x+a2.width,a2.y+a2.height];
  const m=txt.indexOf("Tab start - tab"); const r3=document.createRange(); r3.setStart(t,txt.lastIndexOf("'",m)); r3.setEnd(t,m+'Tab start - tab'.length); const a3=[...r3.getClientRects()]; out.tabFull=[a3[0].x,a3[0].y,a3[a3.length-1].x+a3[a3.length-1].width,a3[0].y+a3[0].height];
  return out; },needles);
fs.writeFileSync('ev/raw-file.boxes.json',JSON.stringify(boxes,null,1)); await p.screenshot({path:'ev/raw-file.png'}); console.log(JSON.stringify(boxes));
await b.close();
