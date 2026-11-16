import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
fs.mkdirSync('/tmp/qa91',{recursive:true});
const s=await open({env:'prod',dir:'/tmp/qa91',user:'bilal.muzamil@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw.txt','utf8').trim(),vp:{width:1600,height:900},dpr:1});
const p=s.page; console.log('marker',JSON.stringify(await s.marker()));
await p.addInitScript(()=>{window.__prints=0; window.print=()=>{window.__prints++;};});
const reqs=[]; p.on('request',r=>{const u=r.url(); if(/report|aging|pdf|print|export/i.test(u)&&!/\.(js|css|svg|png|woff)/.test(u)) reqs.push(r.method()+' '+decodeURIComponent(u).slice(0,250));});
p.context().on('page',np=>console.log('POPUP',np.url()));
p.on('download',d=>console.log('DOWNLOAD',d.suggestedFilename()));
for(const r of ['ar-aging-summary','ar-aging-detail','ar-aging-collection']){ reqs.length=0; await s.go('/reports/'+r); await p.waitForTimeout(6000);
  const btns=await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>/print|export|download|more_h/i.test((b.innerText||'')+(b.getAttribute('data-test-id')||''))).map(b=>(b.getAttribute('data-test-id')||'')+'|'+b.innerText.trim().replace(/\s+/g,' ')));
  console.log('==',r,p.url(),'buttons:',btns.join(' / '));
  const pb=await p.$('button:has-text("Print")'); if(pb){ await pb.click(); await p.waitForTimeout(6000); console.log('print calls',await p.evaluate(()=>window.__prints),'url',p.url()); await p.screenshot({path:`../ev/n/prod-${r}-after-print.png`}); }
  console.log(reqs.filter(x=>!/punch-clock/.test(x)).join('\n')); }
await s.close(); process.exit(0);
