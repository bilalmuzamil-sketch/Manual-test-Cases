import {start,mk,log} from '/tmp/cln/woblib.mjs';
const {browser,page}=await start('/workorders'); const {body}=mk(page);
await page.locator('button[aria-label="Board View"]').click(); await page.waitForTimeout(4000);
for(const n of ['ZZAUTOTEST Ana Alpha','ZZAUTOTEST Ben Bravo']){ const u=page.locator(`button[aria-label="Unpin ${n}"]`).first(); if(await u.count()){ await u.click({force:true}); await page.waitForTimeout(2500); log('unpinned',n);} else log('not pinned',n); }
log('pinned now:',await page.evaluate(()=>[...document.querySelectorAll('button[aria-label^="Unpin "]')].map(b=>b.getAttribute('aria-label')).join(' | ')));
await browser.close();
