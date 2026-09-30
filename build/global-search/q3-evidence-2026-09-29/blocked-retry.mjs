// Try harder on the six blocked checks. Four were blocked because the case supplies the WHOLE
// value (which can never fail) and the fragment I derived matched nothing. A fragment that the
// search does not match is my choice, not a verdict - so try several per field.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
const TRIES=[
 ['C146204','Work order',['Veljkovic','Veljk','Veljko']],
 ['C146220','Customer',['ZZQUEBEXA','ZZQUEBE','QUEBEXA']],
 ['C146221','Customer',['H8A3X9','H8A3','8A3X9','H8A']],
 ['C146241','Parts',['.Brake Parts','Brake Parts','Brake Part','rake Parts']],
 ['C146250','Vendor',['zzhidden.vendor@staging.shopview.local','zzhidden.vendor','zzhidden','hidden.vendor']],
];
const { page, browser } = await boot('/customers', { key:'admin', settle:12000 });
try {
  await page.setViewportSize({width:1440,height:900});
  for (const [cid,tab,terms] of TRIES) {
    console.log(`\n### ${cid} (${tab})`);
    for (const q of terms) {
      await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(500);
      await page.keyboard.press('Control+k'); await page.waitForTimeout(1300);
      const i=page.locator('.search-modal input');
      await i.click({clickCount:3}); await i.fill(''); await i.type(q,{delay:40});
      await page.waitForTimeout(5000);
      await page.evaluate((tb)=>{const t=[...document.querySelectorAll('.search-tabs__tab')]
        .find(e=>new RegExp('^\\s*'+tb.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i').test(e.innerText.trim())); if(t)t.click();},tab);
      await page.waitForTimeout(2100);
      const r=await page.evaluate(()=>[...document.querySelectorAll('.search-row')].slice(0,4).map(x=>{
        const parts=[...x.querySelectorAll('.search-row__meta-part')].map(p=>p.innerText.replace(/\s+/g,' ').trim());
        return {note:parts.find(p=>/^[A-Za-z][A-Za-z \/]{2,30}:\s/.test(p))||null,
                text:x.innerText.replace(/\s+/g,' ').trim().slice(0,90)};}));
      console.log(`  "${q}" -> ${r.length} rows | notes: ${JSON.stringify(r.map(x=>x.note))}`);
      if(r.length && r.some(x=>x.note)) break;   // usable state reached
    }
  }
} finally { await browser.close(); }
