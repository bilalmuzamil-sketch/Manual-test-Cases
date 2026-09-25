// Re-check Problem 3 honestly. The earlier reading was taken on a work order with NO finished line and
// with the tick-lines bar closed - so "Uncomplete appears nowhere" and "Authorization required is
// missing" may both be my own doing. Look at a work order that HAS a finished line, open every menu,
// and open the bar too.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WORDS = ['Request part','Request Part','Delete line','Delete Line','Authorization required','Authorization Required','Uncomplete','Split','Add line note','Save as canned line','Edit labour','Edit labor'];
const { browser, page } = await bootProdLogin('/workorders', { settle: 11000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(22000);
const out = [];
for (const [tag, id] of [['S2-786-complete','4560a837-ee20-46e5-a62c-c6a4892fc85d'], ['S2-810-review','fe72110c-7ff6-47f8-8f83-e3ea447a5280'], ['S2-908-seeded','068f9856-9d28-4500-a3dd-dd6d7aafb15a']]) {
  await openWo(page, id); await page.waitForTimeout(6000);
  const rec = { wo: tag, lines: [], menus: [], bar: null, words: {} };
  rec.lines = await page.evaluate(()=>{ const s=new Set(); const o=[];
    for (const tr of document.querySelectorAll('tr[class*="line-row-"]')) { const i=(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1];
      if (s.has(i)) continue; s.add(i);
      o.push({ id:i, badges:[...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()),
        buttons:[...tr.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()) }); }
    return o; });
  console.log('\n####', tag, '- lines:', JSON.stringify(rec.lines.map(l=>l.badges.join(',')+' -> '+l.buttons.filter(b=>b&&b!=='more_vert'&&b!=='expand_less').join('|'))));
  // every three-dot on every line row, hovered first
  for (const l of rec.lines) {
    const tr = page.locator(`tr.line-row-${l.id}`).first();
    await tr.scrollIntoViewIfNeeded().catch(()=>{}); await tr.hover().catch(()=>{}); await page.waitForTimeout(800);
    const btns = page.locator(`tr.line-row-${l.id} .q-btn:has-text("more_vert"), tr.line-row-${l.id} button:has-text("more_vert")`);
    const n = await btns.count();
    for (let k=0;k<n;k++) { try { await btns.nth(k).click({timeout:6000}); await page.waitForTimeout(1600);
      const items = await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.innerText||'').trim().replace(/\s+/g,' ')).filter(Boolean));
      rec.menus.push({ line: l.badges.join(','), items }); console.log('   menu on', l.badges.join(','), ':', JSON.stringify(items));
      await page.keyboard.press('Escape'); await page.waitForTimeout(700); } catch(e){} }
  }
  // the tick-lines bar, with a line selected
  if (rec.lines.length) {
    const tr = page.locator(`tr.line-row-${rec.lines[0].id}`).first();
    await tr.hover().catch(()=>{}); await page.waitForTimeout(900);
    const cb = page.locator(`[data-test-id="line_checkbox_${rec.lines[0].id}"]`);
    if (await cb.count()) { await cb.first().click({timeout:8000}).catch(()=>{}); await page.waitForTimeout(2500);
      rec.bar = await page.evaluate(()=>{ const el=[...document.querySelectorAll('div')].filter(e=>/\bselected\b/.test(e.innerText||'') && e.querySelector('button,.q-btn') && (e.innerText||'').length<220).sort((a,b)=>a.innerText.length-b.innerText.length)[0];
        return el? (el.innerText||'').replace(/\s+/g,' ').trim() : null; });
      console.log('   bar:', JSON.stringify(rec.bar));
      const more = await page.evaluate(()=>{ const bar=[...document.querySelectorAll('div')].filter(e=>/\bselected\b/.test(e.innerText||'') && e.querySelector('button,.q-btn') && (e.innerText||'').length<220).sort((a,b)=>a.innerText.length-b.innerText.length)[0];
        if(!bar) return 'no bar'; const b=[...bar.querySelectorAll('button,.q-btn')].find(x=>/^More/.test((x.innerText||'').trim())); if(!b) return 'no More'; b.click(); return 'clicked'; });
      if (more === 'clicked') { await page.waitForTimeout(2200);
        rec.barMore = await page.evaluate(()=>{ const m=[...document.querySelectorAll('.q-menu')].filter(x=>x.getBoundingClientRect().width)[0]; return m? [...m.querySelectorAll('.q-item')].map(e=>(e.innerText||'').trim()):null; });
        console.log('   bar More:', JSON.stringify(rec.barMore));
        await page.keyboard.press('Escape'); await page.waitForTimeout(800); }
      await page.screenshot({ path: `${EV}/recheck-${tag}.png`, fullPage: true });
    }
  }
  const t = await bodyText(page);
  for (const w of WORDS) rec.words[w] = t.includes(w);
  console.log('   words anywhere on the page:', JSON.stringify(Object.entries(rec.words).filter(([,v])=>v).map(([k])=>k)));
  out.push(rec);
}
fs.writeFileSync(`${EV}/recheck-problem3.json`, JSON.stringify(out,null,1));
await browser.close();
