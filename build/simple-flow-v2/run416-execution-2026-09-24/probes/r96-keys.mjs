import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const OPEN='281adfa7-5925-4718-936d-91d12cda3873';
const {browser,page}=await bootProdLogin('/workorders',{settle:12000});
console.log(JSON.stringify(await page.evaluate(async(wo)=>{
  const r=await fetch(`https://api.shopview.com/api/work-orders/lines/${wo}`,{credentials:'include'});
  const c=(await r.json()).data.collection;
  const L=c.filter(l=>(l.parts||[]).length>=3)[0];
  const p=L.parts[0];
  return {line:L.line_name, allKeys:Object.keys(p), idish:Object.fromEntries(Object.entries(p).filter(([k,v])=>/id$/i.test(k)))};
},OPEN),null,1));
await browser.close();
