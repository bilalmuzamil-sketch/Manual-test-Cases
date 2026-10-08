import {start} from './woblib.mjs';
const b=await start('/customers','admin'); const {page}=b;
const r=await page.evaluate(async()=>{const o={};for(const q of ['page=2&rowsPerPage=100','query=Fibridge','q=Fibridge','filter=Fibridge','name=Fibridge','search=4 Star']){const x=await fetch('https://sv10043api.qa.shopview.com/api/customers?'+q,{credentials:'include',headers:{Accept:'application/json'}});const j=await x.json();o[q]=[j.data.collection.length,j.data.collection.slice(0,3).map(e=>e.name),JSON.stringify(j.data.pagination)];}return o;});
console.log(JSON.stringify(r,null,1));
const s=page.locator('input').first(); await s.fill('Fibridge').catch(()=>{}); await page.waitForTimeout(4000);
console.log((await page.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(0,900));
await b.browser.close();
