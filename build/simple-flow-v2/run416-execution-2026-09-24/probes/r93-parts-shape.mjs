import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const OPEN='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:12000});
const out=await page.evaluate(async(wo)=>{
  const r=await fetch(`https://api.shopview.com/api/work-orders/lines/${wo}`,{credentials:'include'});
  const j=await r.json(); const c=j.data.collection;
  return c.map(l=>({name:(l.line_name||'').slice(0,26),
    pr:{type:Array.isArray(l.part_requests)?'array':typeof l.part_requests, n:Array.isArray(l.part_requests)?l.part_requests.length:Object.keys(l.part_requests||{}).length,
        keys:Object.keys((Array.isArray(l.part_requests)?l.part_requests[0]:Object.values(l.part_requests||{})[0])||{}).slice(0,22)},
    parts:{type:Array.isArray(l.parts)?'array':typeof l.parts, n:Array.isArray(l.parts)?l.parts.length:Object.keys(l.parts||{}).length,
        keys:Object.keys((Array.isArray(l.parts)?l.parts[0]:Object.values(l.parts||{})[0])||{}).slice(0,22)}}));
},OPEN);
console.log(JSON.stringify(out,null,1).slice(0,2400));
await browser.close();
