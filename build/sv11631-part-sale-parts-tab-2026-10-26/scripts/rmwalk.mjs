import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa26',vp:{width:1440,height:900}}); const p=s.page;
const posts=[]; p.on('response',r=>{ if(r.request().method()!=='GET'&&/adjust/.test(r.url())) posts.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')); });
const desc=()=>p.evaluate(()=>[...document.querySelectorAll('td.description-cell')].map(td=>{const n=td.querySelector('.q-field__native'); const sp=n?([...n.children].find(x=>x.tagName!=='INPUT')||n):td; return (sp.innerText||'').trim()+(sp.scrollWidth>sp.clientWidth+0.5?' [cut]':'');}));
await s.go('/parts/part-sale/90a95f29-f405-4763-834d-6e3a237f8c33/part-requests'); await p.waitForTimeout(7000);
console.log('before',JSON.stringify(await desc()));
for(let k=0;k<2;k++){
  await p.evaluate(()=>{const w=[...document.querySelectorAll('.q-table__middle')].sort((a,b)=>b.scrollWidth-a.scrollWidth)[0]; w.scrollLeft=w.scrollWidth;}); await p.waitForTimeout(600);
  await p.locator('[data-test-id^="cell_part_adjustments_"]').first().click(); await p.waitForTimeout(1500);
  await p.locator('[data-test-id^="button_remove_part_adjustment_"]').first().click(); await p.waitForTimeout(1500);
  const d1=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].filter(e=>e.getBoundingClientRect().width>0).map(e=>(e.getAttribute('data-test-id')||'-')+'|'+e.innerText.replace(/\s+/g,' ').trim()));
  console.log('after bin',JSON.stringify(d1));
  await p.locator('[data-test-id="button_confirm_remove_adjustment"]').click(); await p.waitForTimeout(1500);
  const conf2=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].filter(e=>e.getBoundingClientRect().width>0).map(e=>(e.getAttribute('data-test-id')||'-')+'|'+e.innerText.replace(/\s+/g,' ').trim()).join(' ; '));
  const sure=p.locator('.q-dialog button',{hasText:/Are You Sure/i}); if(await sure.count()){ await sure.first().click(); await p.waitForTimeout(1500); console.log('clicked Are You Sure'); }
  console.log('confirm2',conf2); await p.waitForTimeout(2000);
  const close=p.locator('[data-test-id="button_close_part_adjustments_viewer"]'); if(await close.count()&&await close.isVisible()) { await close.click(); await p.waitForTimeout(1500); }
}
console.log('posts',posts.join(' ; ')); await p.waitForTimeout(1500);
console.log('after',JSON.stringify(await desc()),'feeCol',await p.locator('th',{hasText:'Fees & Discounts'}).count());
await p.screenshot({path:'/tmp/s11631-rmwalk.png'}); await s.close(); process.exit(0);
