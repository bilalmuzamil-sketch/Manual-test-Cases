import {boot} from '/tmp/sv9940/boot.mjs';
const {b,p}=await boot('/parts/orders',{width:2200,height:1200});
console.log('URL:',p.url());
const rows=await p.evaluate(()=>{
  const trs=[...document.querySelectorAll('tr')].slice(0,14);
  return trs.map(tr=>[...tr.querySelectorAll('td,th')].map(t=>t.innerText.trim().replace(/\n/g,' ')).join(' | '));});
rows.forEach(r=>console.log('  ',r.slice(0,190)));
const ids=[...new Set(await p.$$eval('[data-test-id]',e=>e.map(x=>x.getAttribute('data-test-id'))))];
console.log('TESTIDS:', JSON.stringify(ids.filter(i=>/receiv|accept|order|deliver|action/i.test(i)).slice(0,30)));
await p.screenshot({path:'/tmp/sv8447/branch-orders.png'});
await b.close();
