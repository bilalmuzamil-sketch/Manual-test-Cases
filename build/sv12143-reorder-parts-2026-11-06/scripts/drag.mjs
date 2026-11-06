// drag part FROM (name) onto the row of part TO (name) on the Lines tab; prints request/response, toast, order before/after (and after reload)
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const TAG=process.env.TAG||'drag'; const S=JSON.parse(fs.readFileSync(`/tmp/sv12143-${ENV}.json`,'utf8')); const s=await sess(); const p=s.page; const caps=[];
p.on('response',async r=>{ if(r.request().method()!=='GET'&&/\/api\/(?!6364962)/.test(r.url())){ let b='';try{b=(await r.text()).slice(0,300)}catch{} caps.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' :: '+(r.request().postData()||'').slice(0,400)+' -> '+b);} });
const order=()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="part_number_"]')].map(e=>e.innerText.split('\n').filter(x=>x&&!/drag_indicator|edit|more_vert|^\(/.test(x))[0]));
await s.go('/workorders/'+(process.env.WO||S.id)+'/lines'); await p.waitForTimeout(8000); const before=await order(); console.log('before',JSON.stringify(before));
const row=n=>p.locator('[data-test-id^="part_number_"]',{hasText:n}).first();
const fid=await row(process.env.FROM).getAttribute('data-test-id'); const handle=p.locator(`[data-test-id="button_drag_part_${fid.replace('part_number_','')}"]`);
const hb=await handle.boundingBox(); const tb=await row(process.env.TO).boundingBox(); await p.screenshot({path:`../ev/${ENV}-${TAG}-before.png`});
if(process.env.MODE==='dragto'){ await handle.dragTo(row(process.env.TO),{targetPosition:{x:20,y:process.env.BELOW?tb.height*0.85:tb.height*0.15}}); await p.waitForTimeout(3500); }
else { await p.mouse.move(hb.x+hb.width/2,hb.y+hb.height/2); await p.mouse.down(); await p.waitForTimeout(300); const ty=tb.y+(process.env.BELOW?tb.height*0.8:tb.height*0.2); for(let i=1;i<=15;i++){ await p.mouse.move(hb.x+hb.width/2,hb.y+hb.height/2+(ty-(hb.y+hb.height/2))*i/15); await p.waitForTimeout(40); } await p.mouse.up(); await p.waitForTimeout(3500); }
console.log('toasts',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' '))))); const after=await order(); console.log('after',JSON.stringify(after)); await p.screenshot({path:`../ev/${ENV}-${TAG}-after.png`});
await p.reload(); await p.waitForTimeout(8000); console.log('after reload',JSON.stringify(await order()));
console.log('caps',JSON.stringify(caps.filter(c=>!/recent-entities/.test(c)),null,1).slice(0,1500)); fs.writeFileSync(`../ev/${ENV}-${TAG}.json`,JSON.stringify({before,after,caps},null,1)); await s.close(); process.exit(0);
