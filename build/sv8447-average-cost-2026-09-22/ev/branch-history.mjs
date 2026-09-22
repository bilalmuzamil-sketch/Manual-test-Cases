import {boot} from '/tmp/sv9940/boot.mjs';
import fs from 'fs';
const PART='ecaae871-ee9f-4442-a891-b1443f22db7e';
const {b,p}=await boot('/parts/inventory?search=CS-RB-268',{width:2200,height:1200});
const gets=[]; p.on('response',r=>{try{const u=new URL(r.url()); if(u.pathname.startsWith('/api')&&r.request().method()==='GET') gets.push(u.pathname+u.search);}catch(e){}});
await p.waitForTimeout(3000);
const h=await p.$(`[data-test-id="button_part_history_${PART}"]`);
if(h){ const bb=await h.boundingBox(); await p.mouse.click(bb.x+bb.width/2, bb.y+bb.height/2); await p.waitForTimeout(9000); }
const txt=await p.evaluate(()=>document.body.innerText);
fs.writeFileSync('/tmp/sv8447/history.txt', txt);
fs.writeFileSync('/tmp/sv8447/history-calls.txt', gets.join('\n'));
await p.screenshot({path:'/tmp/sv8447/r4-history.png'});
await b.close();
console.log('captured');
