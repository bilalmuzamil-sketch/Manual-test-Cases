import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync(process.argv[2])); const TAG=process.argv[3]; const s=await ob(); const p=s.page; await loc(s);
const gets=[]; p.on('response',async r=>{const u=new URL(r.url()); if(r.request().method()==='GET'&&/customer-account|customer-deposits|transactions|credits/.test(u.pathname)){ let t=''; try{t=(await r.text()).slice(0,600);}catch(e){} gets.push(u.pathname+u.search+' => '+t);} });
for (const tab of ['invoices','payments','deposits']){
  await s.go('/customers/'+A.company_id+'/'+tab); await p.waitForTimeout(3000);
  const tog=p.locator('.q-toggle').filter({hasText:/Open only/i}); if(tab==='invoices' && await tog.count()){ const on=await tog.getAttribute('aria-checked'); if(on==='true'){ await tog.click(); await p.waitForTimeout(2500);} }
  const txt=await p.evaluate(()=>document.querySelector('main, .q-page')?.innerText.replace(/\s+/g,' ').slice(0,500));
  console.log(tab,'::',txt); await p.screenshot({path:`ev/${TAG}-tab-${tab}.png`});
}
console.log('GETS\n'+gets.join('\n').slice(0,2500));
await s.close();
