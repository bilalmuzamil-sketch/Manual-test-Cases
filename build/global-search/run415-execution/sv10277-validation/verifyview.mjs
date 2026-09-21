import { open } from '/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs';
const API='https://sv9160api.qa.shopview.com';
const { page, browser } = await open('sv9160','/workorders','admin');
await page.waitForTimeout(2500);
const get=(u)=>page.evaluate(async(u)=>{const r=await fetch(u,{credentials:'include'});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch{};return j},API+u);
const rec=await get('/api/user/recent-entities');
const items=(rec?.data?.items||[]);
console.log('recent entities, newest first:');
items.slice(0,8).forEach((i,n)=>console.log('   ',n+1,String(i.type).padEnd(14),String(i.primary).slice(0,40)));
const gammaSeen=items.some(i=>/Gamma ZZPRXQ/i.test(String(i.primary)));
const alphaSeen=items.some(i=>/ZZPRXQ Alpha/i.test(String(i.primary)));
console.log('\nINSTRUMENT CHECK — did opening the page register as a view?');
console.log('   Gamma (the one I opened) is in the recently-viewed list:', gammaSeen);
console.log('   Alpha (never opened)  is in the recently-viewed list:', alphaSeen);
console.log(gammaSeen && !alphaSeen ? '   -> the credit landed on Gamma only: the experiment is valid'
                                    : '   -> the credit did NOT land as intended: the experiment proves nothing');
await browser.close();
