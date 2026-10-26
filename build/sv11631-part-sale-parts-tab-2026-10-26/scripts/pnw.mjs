import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2,scrollbars:true});
const p=s.page; await s.go('/parts/part-sale/48ba5757-175a-4701-8c4a-810791ac2ede/part-requests'); await p.waitForTimeout(6500);
const r=await p.evaluate(()=>{ const i=document.querySelector('.base-table tbody .part-number-cell input'); const cs=getComputedStyle(i); const box=i.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
  const m=document.createElement('span'); m.style.cssText='position:absolute;visibility:hidden;white-space:pre;font:'+cs.font+';letter-spacing:'+cs.letterSpacing; document.body.appendChild(m);
  const out={font:cs.font,inputClient:i.clientWidth,textBox:box,pad:cs.paddingLeft+'/'+cs.paddingRight,samples:{}};
  for(const t of ['123456789012','ZZ12CHARPN01','ABCDEFGHIJKL','23-456-78901','HD-123456-AB','WMWMWMWMWMWM','A9B8C7D6E5F4','1R-1808-0001']){ m.textContent=t; out.samples[t]=+m.getBoundingClientRect().width.toFixed(1);} m.remove(); return out; });
console.log(JSON.stringify(r,null,1)); process.exit(0);
