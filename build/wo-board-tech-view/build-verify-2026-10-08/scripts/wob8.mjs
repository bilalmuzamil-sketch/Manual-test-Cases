import {start,mk,log,B} from '/tmp/cln/woblib.mjs';
const {browser,page}=await start('/workorders?status=approved'); const {dump,ov,tip,go,esc,body}=mk(page);
try{
  await page.locator('button[aria-label="List"]').first().click({force:true}).catch(()=>{}); await page.waitForTimeout(4000);
  const rows=await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].slice(0,40).map(r=>r.innerText.replace(/\s+/g,' ').slice(0,80)));
  const pick=[]; for(const st of ['Approved','In Progress','Review','Complete']){ const r=rows.find(x=>x.includes(st)); if(r) pick.push([st,(r.match(/S[\d]+-\d+/)||[])[0]]); }
  log('candidates',JSON.stringify(pick), 'rows sample', rows.slice(0,3).join(' // '));
  for(const [st,num] of pick){ if(!num) continue; await go('/workorders',6000); await page.getByText(num,{exact:true}).first().click().catch(()=>{}); await page.waitForTimeout(8000);
    const info=await page.evaluate(()=>{const ro=document.querySelector('[data-test-id="lead_technician_readonly"]'); const lab=[...document.querySelectorAll('label,.q-field__label')].find(l=>/Lead technician/i.test(l.innerText)); return {readonly:!!ro, roText:ro&&ro.innerText, labelTag: lab&&lab.className};});
    log(st,num,JSON.stringify(info)); }
}catch(e){log('ERR',e.message.slice(0,300));}
await browser.close(); log('DONE');
