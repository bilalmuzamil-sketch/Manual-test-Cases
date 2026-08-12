// probeQ2 — RUNNABILITY reconnaissance of every Parts and Reports surface the 10
// Branko-held cases send a tester to.  Establishes, per page: does the route exist,
// does it land, what filter buttons are on it (LABELS FROM COMPUTED STYLE), what
// toolbar icons, and can an option list be opened.
// This does NOT judge expected behaviour and does NOT touch any case.
const { makeHarness, OUT, APP } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');

// Nav is discovered, never guessed: read the app's own menus first.
(async () => {
  const h = await makeHarness('admin');
  const P = h.page, R = { probe:'Q2', at:new Date().toISOString(), nav:{}, pages:[] };

  await P.goto(APP + '/workorders?tab=all', { waitUntil:'domcontentloaded', timeout:120000 });
  await P.waitForTimeout(10000);

  // ---- discover the top nav + the Parts / Reports menus from the app itself
  R.nav.topLinks = await P.$$eval('[data-test-id="button_desktop_nav_link"], nav a, header a', els =>
    [...new Set(els.map(e => ((e.innerText||'').trim()+' -> '+(e.getAttribute('href')||''))))].filter(Boolean).slice(0,40));

  async function openMenuFor(word) {
    const ok = await P.evaluate((w) => {
      const els=[...document.querySelectorAll('a,button,[role="button"],[data-test-id="button_desktop_nav_link"]')];
      const t=els.find(e=>(e.innerText||'').trim().toLowerCase()===w.toLowerCase());
      if(!t) return false; t.click(); return true;
    }, word);
    await P.waitForTimeout(2500);
    const items = await P.$$eval('.q-menu a, .q-menu [role="menuitem"], .q-menu .q-item', els =>
      els.map(e=>({ text:(e.innerText||'').replace(/\s+/g,' ').trim(), href:e.getAttribute('href')||null })));
    await P.keyboard.press('Escape'); await P.waitForTimeout(600);
    return { clicked:ok, items };
  }
  R.nav.parts   = await openMenuFor('Parts');
  R.nav.reports = await openMenuFor('Reports');

  // ---- walk a route and describe its filter bar as the tester sees it
  async function walk(name, path, opts={}) {
    const rec = { name, path };
    try {
      await P.goto(APP + path, { waitUntil:'domcontentloaded', timeout:120000 });
      await P.waitForTimeout(opts.wait || 10000);
    } catch(e) { rec.gotoError = String(e).slice(0,140); }
    rec.landedOn = P.url();
    rec.redirected = !P.url().includes(path.split('?')[0]);
    rec.h1 = await P.evaluate(()=>{const e=document.querySelector('h1,h2,.text-h5,.page-title');return e?(e.innerText||'').trim().slice(0,80):null;});
    // ANY chip-like control, discovered by test-id prefix AND by shape (icon+label+arrow)
    rec.chipTestIds = await P.$$eval('[data-test-id]', els =>
      [...new Set(els.map(e=>e.getAttribute('data-test-id')))].filter(t=>/filter_chip|filter_bar|toggle_filter|clear_filter|page_search|filter_option/.test(t)));
    rec.chips = await P.$$eval('[data-test-id^="filter_chip_"]', els => els.map(e=>{
      const cs=getComputedStyle(e);
      const icon=e.querySelector('i,svg');
      // the label a tester READS: strip the material-icon ligature words
      const raw=(e.innerText||'').replace(/\s+/g,' ').trim();
      return { id:e.getAttribute('data-test-id'), domText:raw,
        textTransform:cs.textTransform, disabled:e.getAttribute('aria-disabled')==='true',
        iconTag:icon?icon.tagName.toLowerCase():null, iconText:icon?(icon.innerText||'').trim():null,
        hasArrow:/keyboard_arrow_down|expand_more/.test(raw) };
    }));
    // toolbar icon buttons INSIDE the table's own toolbar only (a page-wide sweep counts app chrome)
    rec.toolbar = await P.evaluate(()=>{
      const scopes=[...document.querySelectorAll('.q-table__top, .q-toolbar, [class*="table-top"], [class*="filter-bar"]')];
      const out=[];
      for (const s of scopes) {
        for (const b of s.querySelectorAll('button,[role="button"]')) {
          const i=b.querySelector('i');
          out.push({ id:b.getAttribute('data-test-id'), icon:i?(i.innerText||'').trim():null,
            text:(b.innerText||'').replace(/\s+/g,' ').trim().slice(0,40) });
        }
      }
      return out.slice(0,25);
    });
    rec.bodySnippet = await P.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,420));
    rec.tableRows = await P.evaluate(()=>document.querySelectorAll('tbody tr').length);
    // can the first chip open a real option list?
    if (rec.chips.length) {
      const o = await L.openChip(P, rec.chips[0].id);
      rec.firstChipOpen = { id:rec.chips[0].id, opened:o.found, optionCount:o.options.length,
                            sample:o.options.slice(0,4).map(x=>x.text) };
      await L.closeMenu(P);
    }
    R.pages.push(rec);
    console.log(`${name.padEnd(24)} | ${rec.landedOn.replace(APP,'').slice(0,44).padEnd(46)} | chips=${rec.chips.length} [${rec.chips.map(c=>c.domText.replace(/keyboard_arrow_down/,'').trim()).join(' / ').slice(0,90)}] rows=${rec.tableRows}`);
    return rec;
  }

  R.discoveredAt = new Date().toISOString();
  fs.writeFileSync(`${OUT}/probeQ2-nav.json`, JSON.stringify(R.nav,null,2));
  console.log('TOP NAV:', JSON.stringify(R.nav.topLinks).slice(0,600));
  console.log('PARTS MENU:', JSON.stringify(R.nav.parts.items.map(i=>i.text+'|'+i.href)).slice(0,900));
  console.log('REPORTS MENU:', JSON.stringify(R.nav.reports.items.map(i=>i.text+'|'+i.href)).slice(0,1400));
  fs.writeFileSync(`${OUT}/probeQ2.json`, JSON.stringify({...R, bridgeErrors:h.bridgeErrors, api4xx:h.apiLog.filter(a=>a.s>=400)},null,2));
  await h.browser.close();
})();
