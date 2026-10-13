import {op,J,post,setLoc} from './lib.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('wo1.json')); const PN='ZZ11243-920183', GEN='ZZGENERIC-CABLE';
const s=await op({dpr:2}); const p=s.page; await setLoc(s); const net=[]; const out={};
p.on('response',async r=>{ const u=new URL(r.url()).pathname; if(r.request().method()!=='GET'&&/\/api\/work-orders|\/api\/inventory/.test(u)){ let b=''; try{b=(await r.text()).slice(0,400);}catch(e){} net.push({st:r.status(),url:u,req:(r.request().postData()||'').slice(0,1500),res:b}); } });
const dlg=()=>p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,600)).join(' ## '));
const toast=()=>p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')).join(' / '));
await s.go('/workorders/'+W.wo+'/lines'); await p.waitForTimeout(4000);
// 1. technician adds a generic part via the inline row
await p.locator('[data-test-id="button_add_part"]').click(); await p.waitForTimeout(1500);
await p.keyboard.type(GEN,{delay:60}); await p.waitForTimeout(1500);
out.inlineOptions=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,100)));
await p.keyboard.press('Escape').catch(()=>{});
await p.keyboard.press('Tab'); await p.keyboard.type('Round jacketed 2 wire cable ft (generic)',{delay:30}); await p.keyboard.press('Tab'); await p.keyboard.type('30',{delay:60});
await p.screenshot({path:'ev/a1-inline-filled.png'});
const save=p.locator('button').filter({hasText:/^\s*Save\s*$/}).first(); await save.click(); await p.waitForTimeout(4000);
out.toast1=await toast(); await p.screenshot({path:'ev/a1-after-inline-save.png'});
out.rows=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="part_number_"]')].map(e=>e.getAttribute('data-test-id')+'='+e.innerText.replace(/\s+/g,' ')));
fs.writeFileSync('a1.json',JSON.stringify({out,net},null,1)); console.log(J(out,1500)); console.log(net.map(n=>n.st+' '+n.url+' :: '+n.req.slice(0,500)+' => '+n.res.slice(0,150)).join('\n'));
await s.close();
