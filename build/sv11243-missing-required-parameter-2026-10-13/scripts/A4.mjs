import {op,J,post,setLoc} from './lib.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('wo1.json')); const PID=process.argv[2]; const TAG=process.argv[3]||'a4';
const s=await op({dpr:2}); const p=s.page; await setLoc(s); const net=[]; const out={};
p.on('response',async r=>{ const u=new URL(r.url()).pathname; if(r.request().method()!=='GET'&&/\/api\/work-orders|\/api\/inventory/.test(u)){ let b=''; try{b=(await r.text()).slice(0,500);}catch(e){} net.push({st:r.status(),url:u,req:(r.request().postData()||'').slice(0,1500),res:b}); } });
const dlgT=()=>p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,700)).join(' ## '));
const toast=()=>p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')).join(' / '));
await s.go('/workorders/'+W.wo+'/lines'); await p.waitForTimeout(4000);
const row=p.locator(`[data-test-id="part_number_${PID}"]`).locator('xpath=ancestor::*[contains(@class,"row") or self::tr][1]');
out.rowIds=await p.evaluate(t=>{const e=document.querySelector(`[data-test-id="part_number_${t}"]`); let n=e; for(let i=0;i<5&&n;i++){ n=n.parentElement; if(n.querySelectorAll('button').length) break;} return [...n.querySelectorAll('[data-test-id],button')].map(b=>(b.getAttribute('data-test-id')||'')+'='+b.innerText.trim()).filter(x=>x.length>1);},PID);
console.log('row controls',J(out.rowIds,800));
const pick=p.locator('button').filter({hasText:/^\s*Pick\s*$/}).first(); out.pick=await pick.count(); if(out.pick){ await pick.click(); await p.waitForTimeout(3000); out.dialog=await dlgT(); out.fields=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog input')].map(i=>(i.getAttribute('data-test-id')||i.getAttribute('aria-label')||'?')+'='+i.value)); out.btns=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].map(b=>(b.getAttribute('data-test-id')||'')+'='+b.innerText.trim())); await p.screenshot({path:`ev/${TAG}-1-pick-dialog.png`}); }
out.toast=await toast();
fs.writeFileSync(`${TAG}.json`,JSON.stringify({out,net},null,1)); console.log(J(out,2500)); console.log(net.map(n=>n.st+' '+n.url+' :: '+n.req.slice(0,600)+' => '+n.res.slice(0,300)).join('\n'));
await s.close();
