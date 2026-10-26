import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2});
const A=s.page; const V='f9618e14-2255-470d-afc7-b20c8e7fc33d'; const out={};
const go=async()=>{await s.go(`/parts/vendor/${V}/unpaid-invoices`); await A.waitForTimeout(6000);};
await go();
out.rows=await A.evaluate(()=>{const g=t=>{const r=[...document.querySelectorAll('[data-test-id="table-unpaid-transactions"] tr')].find(r=>r.innerText.includes(t)); const a=r.querySelector('a[href]'); const rb=r.getBoundingClientRect(), ab=a.getBoundingClientRect(); return {row:[rb.x,rb.y,rb.width,rb.height], link:[ab.x,ab.y,ab.width,ab.height], href:a.getAttribute('href'), linkText:a.innerText.trim(), linkColor:getComputedStyle(a).color, linkCursor:getComputedStyle(a).cursor}}; return {credit:g('ZZAUTOTEST-CM-10408'), delivery:g('ZZ10841-P5')};});
console.log(JSON.stringify(out.rows));
await A.screenshot({path:'v6-list.png'});
for (const k of ['delivery','credit']){ await go(); const l=out.rows[k].link; await A.mouse.click(l[0]+l[2]/2,l[1]+l[3]/2); await A.waitForTimeout(5000); out[k+'_url']=A.url(); out[k+'_text']=(await A.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(0,500); await A.screenshot({path:`v6-open-${k}.png`}); console.log(k,'->',A.url(),'|',out[k+'_text'].slice(0,300)); }
fs.writeFileSync('v6.json',JSON.stringify(out));
process.exit(0);
