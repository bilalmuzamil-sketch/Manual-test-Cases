import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const { browser, page } = await boot2('admin', { workplaceId:'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
const T=(s)=>page.waitForTimeout(s);
async function panel(path,chip,label){
  await page.goto('https://app.staging.shopview.com'+path,{waitUntil:'domcontentloaded',timeout:60000}); await T(6000);
  const el=await page.$('[data-test-id='+chip+']'); if(!el){console.log(label,'NOCHIP');return;}
  await el.click(); await T(1500);
  const info=await page.evaluate(()=>{
    const pp=[...document.querySelectorAll('.filter-option-list-panel, .filter-panel, .q-menu')].pop(); if(!pp)return null;
    const search=[...pp.querySelectorAll('input')].map(i=>({ph:i.getAttribute('placeholder'),aria:i.getAttribute('aria-label'),type:i.type})).filter(i=>i.type!=='checkbox');
    const opts=[...pp.querySelectorAll('[data-test-id^=filter_option]')].slice(0,3).map(e=>({dti:e.getAttribute('data-test-id'),lbl:e.getAttribute('aria-label')}));
    const foot=[...pp.querySelectorAll('button')].map(b=>(b.textContent||'').trim()).filter(Boolean);
    const html=pp.innerHTML.slice(0,300);
    return {search,opts,foot,html};
  });
  console.log(label,JSON.stringify(info,null,0).slice(0,900));
  // type in search if present
  const inp=await page.$('.filter-option-list-panel input:not([type=checkbox]), .filter-panel input:not([type=checkbox])');
  if(inp){ await inp.type('z'); await T(1000);
    const after=await page.evaluate(()=>{const pp=[...document.querySelectorAll('.filter-option-list-panel,.filter-panel')].pop(); const n=pp?pp.querySelectorAll('[data-test-id^=filter_option]').length:-1; const nomatch=/no matches|no results|nothing/i.test(pp?pp.textContent:''); return {optsAfterZ:n,nomatch};});
    console.log(label,'SEARCH_TYPED_z',JSON.stringify(after));
  }
  await page.keyboard.press('Escape'); await T(400);
}
await panel('/parts/inventory','filter_chip_category','PARTS_CATEGORY');
await panel('/reports/punch-clock-activities','filter_chip_staffId','REPORTS_STAFF');
await browser.close();
