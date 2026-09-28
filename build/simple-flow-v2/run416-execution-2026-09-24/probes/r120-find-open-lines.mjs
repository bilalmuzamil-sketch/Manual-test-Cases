// C44597 run 2 needs a work order with two or more OPEN (approved) lines, so that selecting them
// all is genuinely "every open line" and the bar should read Complete all lines.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,ctx,page,APIH}=await bootProdLogin('/workorders',{settle:12000});
const call=async p=>{const q=await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
  try{return JSON.parse(await q.text());}catch{return null;}};
const wos=(await call('/api/work-orders?pagination%5BrowsPerPage%5D=60&pagination%5Bpage%5D=1&search=&showMyWorkOrders=0'))?.data?.work_orders||[];
console.log('looking through',wos.length,'work orders');
const hits=[];
for(const w of wos){
  const L=await call(`/api/work-orders/lines/${w.id}`);
  const lines=L?.data?.collection||[];
  const open=lines.filter(l=>/approved/i.test(l.status_display||l.status||''));
  if(open.length>=2){ hits.push({id:w.id, wo:(lines[0]||{}).work_order_display_number||(lines[0]||{}).work_order_number,
      open:open.length, total:lines.length, states:lines.map(l=>l.status_display||l.status)});
    console.log(' ',w.id.slice(0,8),(lines[0]||{}).work_order_display_number,'| open approved lines:',open.length,'of',lines.length,JSON.stringify(lines.map(l=>l.status_display)));
    if(hits.length>=4) break; }
}
console.log('\nfound',hits.length,'work orders with two or more open lines');
fs.writeFileSync(`${EV}/r120-open-lines.json`,JSON.stringify(hits,null,1));
await browser.close();
