import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:2});
const p=s.page; const wo=fs.readFileSync('/tmp/qa11685/w/seed-wo.txt','utf8').trim(); const go=process.argv[2]==='send';
console.log('marker',JSON.stringify(await s.marker()));
await s.go(`/workorders/${wo}/finance`); await p.waitForTimeout(6000);
const b=await p.$('[data-test-id=button_send_email]'); const bb=await b.boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(2500);
const d=await p.evaluate(()=>{ const d=document.querySelector('.q-dialog'); if(!d) return null; return {text:d.innerText.replace(/\n+/g,' | ').slice(0,800), ids:[...d.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')+(e.getAttribute('aria-checked')!=null?'='+e.getAttribute('aria-checked'):'')).join(' ')}; });
console.log(JSON.stringify(d,null,1)); await p.screenshot({path:'/tmp/qa11685/w/mail-dialog.png'});
if(go){
  // untick every ticked contact checkbox except attachments toggle
  const boxes=await p.$$('.q-dialog .q-checkbox[aria-checked="true"]');
  for(const x of boxes){ const id=await x.getAttribute('data-test-id'); if(id==='checkbox_include_customer_attachments') continue; await x.click(); }
  const inp=await p.$('.q-dialog [data-test-id=input_optional_emails] input, .q-dialog [data-test-id=input_optional_emails] textarea, .q-dialog [data-test-id=input_optional_emails]'); console.log('email field tag',await inp.evaluate(e=>e.tagName)); await inp.click(); await inp.type('bilal.muzamil+sv11685@shopview.com'); await p.keyboard.press('Enter'); await p.waitForTimeout(500);
  
  const still=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog .q-checkbox')].map(e=>(e.getAttribute('data-test-id')||e.innerText.trim())+'='+e.getAttribute('aria-checked')).join(' ; ')); console.log('checkboxes now',still);
  const reqs=[]; p.on('request',r=>{ if(/send-email/.test(r.url())) reqs.push(r.method()+' '+r.url()+' '+(r.postData()||'').slice(0,600)); });
  await p.screenshot({path:'/tmp/qa11685/w/mail-filled.png'});
  const sends=await p.$$('[data-test-id=button_send_email]'); const last=sends[sends.length-1]; await last.click(); await p.waitForTimeout(5000);
  const toast=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.trim()).join(' | ')); console.log('toast',toast); console.log(reqs.join('\n'));
}
process.exit(0);
