import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2,scrollbars:true});
const p=s.page; const O='/tmp/qa11631/w/act/'; fs.mkdirSync(O,{recursive:true}); const log=[];
const parts=async id=>(await s.api(`/api/work-orders/${id}/parts/list-requests-by-line?search=`)).json.data.collection.flatMap(l=>l.part_requests).map(x=>({id:x.id,d:x.description,st:x.status}));
const dlg=()=>p.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().height>0).pop(); return d?{text:d.innerText.replace(/\n+/g,' | ').slice(0,300),btns:[...d.querySelectorAll('button')].map(b=>(b.getAttribute('data-test-id')||'')+':'+b.innerText.trim())}:null});
const clickId=async tid=>{const e=await p.$(`[data-test-id="${tid}"]`); await e.scrollIntoViewIfNeeded(); const b=await e.boundingBox(); await p.mouse.click(b.x+b.width/2,b.y+b.height/2); await p.waitForTimeout(1800);};
// PICK on P2-162 first In Stock row
const P162='90a95f29-f405-4763-834d-6e3a237f8c33'; let before=await parts(P162); const instock=before.find(x=>/stock/i.test(x.st)); 
await s.go(`/parts/part-sale/${P162}/part-requests`); await p.waitForTimeout(6500); const w0=s.writes.length;
await p.evaluate(id=>document.querySelector(`[data-test-id="cell_part_request_primary_action_${id}"] button`).setAttribute('data-qa-pick','1'),instock.id);
const pk=await p.$('[data-qa-pick]'); const pb=await pk.boundingBox(); await p.mouse.click(pb.x+pb.width/2,pb.y+pb.height/2); await p.waitForTimeout(2500);
let d=await dlg(); log.push({step:'pick click',part:instock.d,dialog:d}); await p.screenshot({path:O+'pick-1.png'});
if(d){ const conf=d.btns.find(b=>/pick|confirm|save|yes/i.test(b)); if(conf){ const tid=conf.split(':')[0]; if(tid) await clickId(tid); else { await p.getByRole('button',{name:conf.split(':')[1]}).last().click(); await p.waitForTimeout(2000);} } log.push({step:'pick confirm',dialog:await dlg()}); }
let after=await parts(P162); log.push({pick:{before:instock.st,after:after.find(x=>x.id===instock.id)?.st,writes:s.writes.slice(w0)}}); await p.screenshot({path:O+'pick-2.png'});
// RETURN: open dialog on first row with return button, record and cancel
const rt=await p.evaluate(()=>{const b=document.querySelector('[data-test-id^=button_return_part_request]'); b.setAttribute('data-qa-ret','1'); return b.getAttribute('data-test-id');});
const rb=await (await p.$('[data-qa-ret]')).boundingBox(); await p.mouse.click(rb.x+rb.width/2,rb.y+rb.height/2); await p.waitForTimeout(2000); log.push({step:'return click',id:rt,dialog:await dlg()}); await p.screenshot({path:O+'return-1.png'});
await p.keyboard.press('Escape'); await p.waitForTimeout(800);
// DELETE on P2-109 last ordinary part (Washer)
const P109='48ba5757-175a-4701-8c4a-810791ac2ede'; before=await parts(P109); const del=before.filter(x=>/Washer/.test(x.d)).pop();
await s.go(`/parts/part-sale/${P109}/part-requests`); await p.waitForTimeout(6500); const w1=s.writes.length;
const steps=await s.confirm(`button_delete_part_request_${del.id}`,{shotPrefix:O+'delete'}); log.push({step:'delete',part:del.d,steps});
after=await parts(P109); log.push({delete:{count_before:before.length,count_after:after.length,still_there:!!after.find(x=>x.id===del.id),writes:s.writes.slice(w1)}});
fs.writeFileSync(O+'act.json',JSON.stringify(log,null,1)); console.log(JSON.stringify(log,null,1).slice(0,4000)); process.exit(0);
