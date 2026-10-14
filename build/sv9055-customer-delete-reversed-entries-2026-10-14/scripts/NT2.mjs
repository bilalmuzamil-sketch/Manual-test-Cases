import {op,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('NT1.json')); const s=await op(); const p=s.page; await loc(s);
await s.go('/customers/'+A.company_id); await p.waitForTimeout(4000);
const tabs=await p.evaluate(()=>[...document.querySelectorAll('.q-tab')].map(e=>e.innerText.trim().replace(/\s+/g,' ')));
console.log('url',p.url(),'tabs',J(tabs,400));
await p.screenshot({path:'ev/NT2-1-customer.png'});
for(const re of [/^Work Orders/i,/^Invoices/i,/^Payments/i]){
  const i=tabs.findIndex(t=>re.test(t)); if(i<0){console.log('no tab',re);continue;}
  await p.locator('.q-tab').nth(i).click(); await p.waitForTimeout(3000);
  const name=String(re).replace(/\W/g,''); await p.screenshot({path:`ev/NT2-${name}.png`});
  console.log(name, J(await p.evaluate(()=>{const t=document.querySelector('.q-table, table'); return t?t.innerText.replace(/\s+/g,' ').slice(0,500):document.querySelector('.q-tab-panel, main')?.innerText.slice(0,400)}),600));
}
await s.close();
