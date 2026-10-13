import {op,J,post,setLoc} from './lib.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('wo1.json')); const PID=process.argv[2];
const s=await op({dpr:1}); const p=s.page; await setLoc(s); const net=[];
p.on('response',async r=>{ const u=new URL(r.url()).pathname; if(r.request().method()!=='GET'&&/\/api\/work-orders/.test(u)){ let b=''; try{b=(await r.text()).slice(0,300);}catch(e){} net.push(r.status()+' '+u+' :: '+(r.request().postData()||'').slice(0,300)+' => '+b); } });
await s.go('/workorders/'+W.wo+'/lines'); await p.waitForTimeout(4000);
const btn=await p.evaluate(t=>{const e=document.querySelector(`[data-test-id="part_number_${t}"]`); let n=e; for(let i=0;i<6&&n;i++){ n=n.parentElement; const b=n.querySelector('[data-test-id="button_part_request_action"]'); if(b){ const r=b.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,t:b.innerText}; } } return null;},PID);
console.log('btn',J(btn)); if(btn){ await p.mouse.click(btn.x,btn.y); await p.waitForTimeout(3500); }
console.log('dialog',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,300)).join(' ## ')));
await p.reload(); await p.waitForTimeout(4000);
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="part_number_"]')].map(e=>e.getAttribute('data-test-id').replace('part_number_','')+' | '+e.closest('div.row,tr')?.innerText.replace(/\s+/g,' ').slice(0,120)).join('\n')));
console.log(net.join('\n')); await s.close();
