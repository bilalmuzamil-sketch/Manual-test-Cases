import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const OPEN='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:12000});
const out=await page.evaluate(async(wo)=>{
  const r=await fetch(`https://api.shopview.com/api/work-orders/lines/${wo}`,{credentials:'include'});
  const j=await r.json().catch(()=>null);
  const shape=(o,d=0)=>{ if(d>3||o===null||typeof o!=='object')return typeof o;
    if(Array.isArray(o))return o.length?['['+o.length+']',shape(o[0],d+1)]:'[]';
    const e={}; for(const k of Object.keys(o).slice(0,28)) e[k]=shape(o[k],d+1); return e;};
  return {status:r.status, shape:shape(j), topKeys:Object.keys(j||{})};
},OPEN);
console.log(JSON.stringify(out,null,1).slice(0,2600));
await browser.close();
