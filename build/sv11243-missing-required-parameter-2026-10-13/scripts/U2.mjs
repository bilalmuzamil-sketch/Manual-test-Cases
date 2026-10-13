import {op,J,post,setLoc} from './lib.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('wo1.json')); const PN='ZZ11243-920183';
const s=await op({dpr:2}); const p=s.page; await setLoc(s); const net=[];
p.on('response',async r=>{ if(r.request().method()!=='GET'&&/\/api\/work-orders/.test(r.url())){ let b=''; try{b=(await r.text()).slice(0,300);}catch(e){} net.push({st:r.status(),url:new URL(r.url()).pathname,req:(r.request().postData()||'').slice(0,900),res:b}); } });
await s.go('/workorders/'+W.wo+'/lines'); await p.waitForTimeout(4000);
await p.locator('[data-test-id="button_add_part"]').click(); await p.waitForTimeout(2500);
const dlg=()=>p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,500)).join(' ## '));
console.log('dialog0',await dlg());
console.log('ids',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')).join(' ')));
// part number select: type PN, read options
const sel=p.locator('.q-dialog [data-test-id="select_part"]'); await sel.click(); await p.waitForTimeout(800); await p.keyboard.type(PN,{delay:80}); await p.waitForTimeout(3500);
const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,120)));
console.log('options',J(opts,800)); await p.screenshot({path:'u2-options.png'});
fs.writeFileSync('u2.json',JSON.stringify({opts,net},null,1));
await s.close();
