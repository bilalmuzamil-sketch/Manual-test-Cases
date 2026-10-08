import {start,mk,log,B} from '/tmp/cln/woblib.mjs';
const {browser,page}=await start('/workorders'); const {dump,ov,tip,go,esc,body}=mk(page);
try{
  await page.locator('button[aria-label="Tech View"]').click(); await page.waitForTimeout(4000);
  const cs=page.locator('button[aria-label="Column Selection"]').first(); await cs.click({force:true}); await page.waitForTimeout(1500);
  log('TV Column Selection full:',await page.evaluate(()=>[...document.querySelectorAll('.q-menu')].map(m=>m.innerText.replace(/\s+/g,' ')).join(' || ')));
  log('menu buttons:',await page.evaluate(()=>[...document.querySelectorAll('.q-menu button')].map(b=>(b.innerText||b.getAttribute('aria-label')).trim()).join(' | ')));
  await dump('columns-techview-menu'); await esc();
  log('aria near header row:',await page.evaluate(()=>[...document.querySelectorAll('thead button, thead [role=button], button[aria-label*="all" i]')].map(b=>b.getAttribute('aria-label')||b.innerText).join(' | ')));
  const ca=page.locator('button[aria-label*="ollapse all"], button[aria-label*="xpand all"]').first(); if(await ca.count()){ log('collapse-all btn:',await ca.getAttribute('aria-label'),'tooltip:',await tip(ca)); }
  await page.locator('button[aria-label^="More actions for"]').first().click({force:true}); await page.waitForTimeout(1200);
  await page.locator('.q-menu .q-item',{hasText:'Reassign lead technician'}).first().click(); await page.waitForTimeout(2000);
  log('reassign search placeholder:',await page.evaluate(()=>[...document.querySelectorAll('.q-dialog input')].map(i=>i.placeholder||i.getAttribute('aria-label')).join(' | ')));
  await page.locator('.q-dialog input').first().fill('ral'); await page.waitForTimeout(1500); log('search "ral":',(await ov()).slice(0,300));
  await page.locator('.q-dialog input').first().fill('zzqx'); await page.waitForTimeout(1500); log('search "zzqx":',(await ov()).slice(0,300));
  await page.locator('.q-dialog button',{hasText:/^Cancel$/}).click();
}catch(e){log('ERR',e.message.slice(0,300));}
await browser.close(); log('DONE');
