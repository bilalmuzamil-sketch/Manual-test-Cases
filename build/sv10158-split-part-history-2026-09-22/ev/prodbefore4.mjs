import {boot} from '/tmp/prod9940/boot.mjs';
import {mkApi} from '/tmp/sv10158/prodlib.mjs';
import fs from 'fs';
const WO='b172fe19-a99c-41dc-aa1d-b52a1955fa9e';    // S2-811
const PART='00eb80a9-6e9c-4ee4-b57d-23f0e2615fb6';  // 1238213
const {b,p,reqs}=await boot('/workorders',{width:2400,height:1200});
const api=mkApi(p); const rec={};
const hist=async()=>{const r=await api('GET',`/api/parts/history/${PART}?pagination[rowsPerPage]=30&pagination[page]=1&pagination[sortBy]=&pagination[descending]=false&search=`);
  const d=(r.body||{}).data; const c=(d&&d.collection)||d||[]; return Array.isArray(c)?c:[];};

// 0) org setting
const st=await api('GET','/api/organizations/settings');
const AP=JSON.stringify(st.body||{}).match(/"autoPickInventoryParts":\s*(true|false)/);
console.log('autoPickInventoryParts =', AP?AP[1]:'?');

// 1) pick a live line
const L=await api('GET',`/api/work-orders/lines/${WO}`);
const lines=((L.body||{}).data||{}).collection||[];
console.log('LINES:',lines.map(l=>`${(l.line_id||'').slice(0,8)}:${l.status}`).join(' '));
const line=lines.find(l=>l.status!=='complete')||lines[0];
const LINE=line.line_id;
console.log('USING LINE',LINE.slice(0,8),'status',line.status);

const c=await api('GET','/api/inventory/categories');
const CAT=((((c.body||{}).data)||{}).collection||[])[0].value;

// 2) seed
const s=await api('POST','/api/work-orders/part/make-request',
  {work_order:WO, line:LINE, description:'ZZAUTOTEST SV-10158 prod before', quantity:2,
   part_source_type:'inventory', inventory_part_id:PART, sell_price:151.38, cost:16.82, part_category_id:CAT});
const pr=(((s.body||{}).data)||{}).part_request||{};
console.log('SEED:',s.status,'| status =',pr.status);

// 3) AUTHORIZE the line  (a quoted line yields a quoted, unpickable request)
const az=await api('POST','/api/work-orders/lines/change-lines',
  {workOrderId:WO, lines:[LINE], field:'status', value:'authorized'});
console.log('AUTHORIZE:',az.status, JSON.stringify(az.body||{}).slice(0,140));
await p.waitForTimeout(3000);

// 4) re-read the request; pick explicitly if still not staged
const rq=await api('GET',`/api/work-orders/${WO}/parts/list-requests-by-line?search=`);
const all=[].concat(...(((rq.body||{}).data||{}).collection||[]).map(x=>x.part_requests||[]));
const mine=all.find(x=>x.id===pr.id)||{};
console.log('REQ AFTER AUTHORIZE: status =',mine.status);
if(mine.status!=='received'){
  const pk=await api('POST',`/api/work-orders/${WO}/pick-inventory-parts`,{part_request_ids:[pr.id]});
  console.log('PICK:',pk.status, JSON.stringify(pk.body||{}).slice(0,140));
  await p.waitForTimeout(3000);
}

// 5) THE GATE — the staged part's context menu must exist
await p.goto(`https://app.shopview.com/workorders/${WO}/lines`,{waitUntil:'commit',timeout:120000});
await p.waitForTimeout(16000);
const staged=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(i=>/^button_part_context_menu_/.test(i)));
console.log('STAGED PART MENUS:',JSON.stringify(staged));
rec.staged=staged;
if(!staged.length){ console.log('>>> GATE FAILED — part not staged, ABORTING before the split'); await b.close(); process.exit(3); }

const b0=await hist(); rec.beforeIds=b0.map(e=>e.id);
console.log('HISTORY BEFORE SPLIT:',b0.length);
b0.slice(0,3).forEach(e=>console.log('    ',e.eventType,'|',e.eventName));
await p.goto('https://app.shopview.com/parts/inventory?search=1238213',{waitUntil:'commit',timeout:120000});
await p.waitForTimeout(14000);
let h=await p.$(`[data-test-id="button_part_history_${PART}"]`);
if(h){const x=await h.boundingBox(); await p.mouse.click(x.x+x.width/2,x.y+x.height/2); await p.waitForTimeout(9000);}
await p.screenshot({path:'/tmp/sv10158/Q1-history-before.png'});

// 6) split through the screen
await p.goto(`https://app.shopview.com/workorders/${WO}/lines`,{waitUntil:'commit',timeout:120000});
await p.waitForTimeout(16000);
const cb=await p.$(`[data-test-id="line_checkbox_${LINE}"]`);
const row=await p.evaluateHandle((id)=>document.querySelector(`[data-test-id="line_checkbox_${id}"]`).closest('tr'),LINE);
await row.asElement().hover().catch(()=>{}); await p.waitForTimeout(900);
const bb=await cb.boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(1500);
console.log('checked =',await p.getAttribute(`[data-test-id="line_checkbox_${LINE}"]`,'aria-checked').catch(()=>null));
const bulk=await p.$('[data-test-id="button_line_bulk_action"]'); const b2=await bulk.boundingBox();
await p.mouse.click(b2.x+b2.width/2,b2.y+b2.height/2); await p.waitForTimeout(2500);
const mi=await p.$('[data-test-id="menu_item_split_wo"]'); const b3=await mi.boundingBox();
await p.mouse.click(b3.x+b3.width/2,b3.y+b3.height/2); await p.waitForTimeout(1600);
await p.mouse.click(b3.x+b3.width/2,b3.y+b3.height/2); await p.waitForTimeout(15000);
console.log('URL AFTER SPLIT:',p.url()); rec.afterUrl=p.url();
await p.waitForTimeout(3000);
const a0=await hist(); const nw=a0.filter(e=>!rec.beforeIds.includes(e.id));
console.log('HISTORY AFTER SPLIT:',a0.length,'| NEW',nw.length);
nw.forEach(e=>console.log('    *',e.eventType,'|',e.eventName));
rec.after=a0.length; rec.new=nw;
await p.goto('https://app.shopview.com/parts/inventory?search=1238213',{waitUntil:'commit',timeout:120000});
await p.waitForTimeout(14000);
h=await p.$(`[data-test-id="button_part_history_${PART}"]`);
if(h){const x=await h.boundingBox(); await p.mouse.click(x.x+x.width/2,x.y+x.height/2); await p.waitForTimeout(9000);}
await p.screenshot({path:'/tmp/sv10158/Q2-history-after.png'});
fs.writeFileSync('/tmp/sv10158/prodbefore4.json',JSON.stringify(rec,null,1));
await b.close();
console.log('--- writes ---'); reqs.filter(r=>/split|make-request|pick|change-lines/.test(r)).forEach(r=>console.log('   ',r.slice(0,110)));
