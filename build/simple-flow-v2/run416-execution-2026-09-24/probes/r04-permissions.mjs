// Put myself into the limited role (no Pick parts, no Order parts, no See Financial Data), prove the
// permissions really dropped, read what the screens show, then put my role back - always.
// Serves C44574(1), C44582, C44580(3), C44587, C44591(4), C44607, C44608, C44609.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText } from './lib3.mjs';
import { setMyRole } from '../seed/lib-role.mjs';
import { openPartsTab, readParts } from '../seed/lib-parts.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const LIMITED='ZZAUTOTEST No Parts Perms', FULL='Admin';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 10000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const perms = async () => { const j = await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json(); return (j?.data?.fe_permissions||[]); };
const out = { permsBefore: (await perms()).length };
console.log('permissions as Admin:', out.permsBefore);
try {
  console.log('switching ->', await setMyRole(page, FULL, LIMITED));
  out.permsLimited = (await perms()).length;
  console.log('permissions in the limited role:', out.permsLimited, '| dropped by', out.permsBefore - out.permsLimited);
  if (out.permsLimited >= out.permsBefore) { console.log('THE SWITCH DID NOT REDUCE ANYTHING - not judging on this reading'); }
  else {
    // the work order, as this person sees it
    await openWo(page, WO); await page.waitForTimeout(6000);
    const t = await bodyText(page);
    out.lineChecks = await page.evaluate(()=>({ checkboxes: document.querySelectorAll('[data-test-id^="line_checkbox_"]').length,
      lineRows: document.querySelectorAll('tr[class*="line-row-"]').length }));
    out.money = { dollarSigns: (t.match(/\$/g)||[]).length, marginColumn: t.includes('Margin'), rateColumn: t.includes('Rate'), totalColumn: t.includes('Total') };
    console.log('line tick boxes:', JSON.stringify(out.lineChecks), '| money on the page:', JSON.stringify(out.money));
    await page.screenshot({ path: `${EV}/limited-work-order.png`, fullPage: true });
    fs.writeFileSync(`${EV}/limited-work-order.txt`, t);
    // the part rows
    await openPartsTab(page, WO);
    out.parts = await readParts(page);
    console.log('parts as this person:'); for (const p of out.parts) console.log('  ', JSON.stringify(p.badges), '->', JSON.stringify(p.actions));
    await page.screenshot({ path: `${EV}/limited-parts.png`, fullPage: true });
    // the bulk bar
    await openWo(page, WO); await page.waitForTimeout(5000);
    const ids = await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(tr=>(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))]);
    if (ids.length) { const tr=page.locator(`tr.line-row-${ids[0]}`).first(); await tr.hover().catch(()=>{}); await page.waitForTimeout(900);
      const cb = page.locator(`[data-test-id="line_checkbox_${ids[0]}"]`);
      out.tickBoxPresent = await cb.count();
      if (out.tickBoxPresent) { await cb.first().click({timeout:9000}).catch(()=>{}); await page.waitForTimeout(2500); }
      out.bar = await page.evaluate(()=>{ const el=[...document.querySelectorAll('div')].filter(e=>/\bselected\b/.test(e.innerText||'') && e.querySelector('button,.q-btn') && (e.innerText||'').length<220).sort((a,b)=>a.innerText.length-b.innerText.length)[0];
        return el? (el.innerText||'').replace(/\s+/g,' ').trim() : null; });
      console.log('tick boxes present:', out.tickBoxPresent, '| bar:', JSON.stringify(out.bar));
      await page.screenshot({ path: `${EV}/limited-bulk-bar.png` }); }
    // the receive window, if it is still offered
    const rec = page.locator('button:has-text("Receive"), .q-btn:has-text("Receive")').first();
    out.receiveOffered = await page.locator('button:has-text("Receive"), .q-btn:has-text("Receive")').count();
    if (out.receiveOffered) { await rec.click().catch(()=>{}); await page.waitForTimeout(6000);
      out.receiveModal = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
        return d? { text:(d.innerText||'').replace(/\s+/g,' ').slice(0,700), hasMoney:/\$/.test(d.innerText||''),
          fields:[...d.querySelectorAll('.q-field')].map(f=>(f.innerText||'').split('\n')[0]) } : null; });
      console.log('receive window without financial access:', JSON.stringify(out.receiveModal));
      await page.screenshot({ path: `${EV}/limited-receive-modal.png` }); }
  }
} catch (e) { out.error = e.message.split('\n')[0]; console.log('ERROR:', out.error); }
// --- always put the role back
console.log('\nrestoring ->', await setMyRole(page, LIMITED, FULL));
out.permsAfter = (await perms()).length;
console.log('permissions after restoring:', out.permsAfter, '(should be', out.permsBefore + ')');
fs.writeFileSync(`${EV}/rerun-permissions.json`, JSON.stringify(out,null,1));
await browser.close();
