// C55673 Enter opens the top result · C55680 arrows skip group headings · C55675 the empty message
// · C55674 reachable on a phone and a tablet.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const out = {};

// C55675 - what the screen actually SAYS when nothing matches
await P.openPalette(b.page, 'click');
await P.type(b.page, 'ZZNOSUCHRECORD9999', 3600);
const s = await P.read(b.page);
out.C55675 = { rowCount: s.rowCount, body: (s.bodyText || '').slice(0, 300), spinner:
  await b.page.evaluate(() => !!document.querySelector('.search-modal .q-spinner, .search-modal [class*="loading"]')) };
console.log('C55675 rows:', out.C55675.rowCount, '| spinner:', out.C55675.spinner);
console.log('   screen says:', out.C55675.body);
await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(600);

// C55673 - type, then Enter with NO arrow key first
await P.openPalette(b.page, 'click');
await P.type(b.page, 'Bridgeport', 3600);
const pre = await P.read(b.page);
out.C55673 = { before: b.page.url(), selectedIndex: pre.selectedIndex, top: (pre.rows[0] || {}).text };
await b.page.keyboard.press('Enter');
await b.page.waitForTimeout(8000);
out.C55673.after = b.page.url();
out.C55673.navigated = out.C55673.after !== out.C55673.before;
console.log(`C55673 top row auto-highlighted at index ${out.C55673.selectedIndex}; Enter -> ${out.C55673.navigated ? 'opened ' + out.C55673.after : 'NOTHING HAPPENED'}`);

// C55680 - arrow down through a multi-group result set, recording what is highlighted each time
await P.openPalette(b.page, 'click');
await P.type(b.page, 'ZZAUTOTEST', 3600);
const steps = [];
for (let i = 0; i < 12; i++) {
  const st = await b.page.evaluate(() => {
    const m = document.querySelector('.search-modal');
    const sel = m.querySelector('.search-row--selected');
    const heads = [...m.querySelectorAll('.search-group__header')];
    return { selected: sel ? (sel.innerText || '').replace(/\s+/g, ' ').slice(0, 60) : null,
             headHighlighted: heads.some(h => h.className.includes('selected') || h.getAttribute('aria-selected') === 'true') };
  });
  steps.push(st);
  await b.page.keyboard.press('ArrowDown'); await b.page.waitForTimeout(260);
}
const up = [];
for (let i = 0; i < 6; i++) {
  await b.page.keyboard.press('ArrowUp'); await b.page.waitForTimeout(260);
  up.push(await b.page.evaluate(() => {
    const sel = document.querySelector('.search-modal .search-row--selected');
    return sel ? (sel.innerText || '').replace(/\s+/g, ' ').slice(0, 60) : null;
  }));
}
out.C55680 = { down: steps, up, headsSeen: steps.filter(s => s.headHighlighted).length,
               nulls: steps.filter(s => s.selected === null).length };
console.log('C55680 down:'); steps.forEach((s, i) => console.log(`   ${i}. ${s.selected ?? '(NOTHING HIGHLIGHTED)'}${s.headHighlighted ? '  <-- A HEADING' : ''}`));
console.log('C55680 up  :', up.join(' | '));
await b.page.keyboard.press('Escape');

// C55674 - phone and tablet
for (const [name, vp] of [['phone', { width: 390, height: 844 }], ['tablet', { width: 820, height: 1180 }]]) {
  await b.page.setViewportSize(vp);
  await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
  await b.page.waitForTimeout(6000);
  const r = await b.page.evaluate(() => {
    const t = [...document.querySelectorAll('button,[class*="search"],[role="button"]')]
      .filter(e => /search/i.test(e.className + ' ' + (e.getAttribute('aria-label') || '')))
      .map(e => ({ cls: String(e.className).slice(0, 60), vis: !!(e.offsetWidth || e.offsetHeight) }));
    return t.slice(0, 6);
  });
  const trig = await b.page.$('.global-search__trigger, [class*="global-search"]');
  if (trig) { await trig.click().catch(() => {}); await b.page.waitForTimeout(2500); }
  const snap = await P.read(b.page);
  out['C55674_' + name] = { triggers: r, opened: snap.open === true, geometry: snap.geometry || null };
  console.log(`C55674 ${name}: palette opened = ${snap.open === true}`, snap.geometry ? JSON.stringify(snap.geometry) : '');
  if (snap.open) await b.page.keyboard.press('Escape');
}
fs.writeFileSync('sweep-v1b.json', JSON.stringify(out, null, 1));
await b.browser.close();
