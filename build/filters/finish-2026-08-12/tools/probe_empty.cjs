// probe_empty.cjs — C38897 done carefully, with the check PROVEN ABLE TO FAIL.
//
// The claim under test is an ABSENCE ("the empty message offers no way to clear
// the search on its own"), so the scanner is first run in a state where the
// control IS present.  If it cannot see it there, the absence means nothing.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');
const R = { read_at_utc: new Date().toISOString(), stages: [] };

const SCAN = () => {
  const vis = el => { const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0' && r.width > 0 && r.height > 0; };
  const all = [...document.querySelectorAll('*')].filter(vis);
  return {
    // every interactive thing with a test id
    tids: all.filter(e => e.getAttribute('data-test-id')).map(e => ({ tid: e.getAttribute('data-test-id'), t: (e.innerText || '').trim().slice(0, 60) })),
    // the empty-state block, whatever it says
    empty_block: (() => {
      const c = all.filter(e => /^No .*(match|found)/i.test((e.innerText || '').trim()));
      if (!c.length) return null;
      const el = c[c.length - 1].closest('div');
      return { painted: (el.innerText || '').trim().slice(0, 400),
               buttons: [...el.querySelectorAll('button,[role=button],a')].map(b => ({ t: (b.innerText || '').trim().slice(0, 60), tid: b.getAttribute('data-test-id') })) };
    })(),
    body_rows: document.querySelectorAll('tbody tr').length,
    row_texts: [...document.querySelectorAll('tbody tr')].slice(0, 3).map(r => (r.innerText || '').replace(/\s+/g, ' ').slice(0, 70))
  };
};

(async () => {
  const h = await makeHarness('admin');
  const p = h.page;
  const stage = async (label, extra = {}) => { const s = await p.evaluate(SCAN); R.stages.push(Object.assign({ label, url: p.url(), scan: s }, extra));
    console.log(`\n### ${label}\n url: ${p.url()}\n rows: ${s.body_rows} ${JSON.stringify(s.row_texts)}\n empty: ${JSON.stringify(s.empty_block)}\n clearish tids: ${JSON.stringify(s.tids.filter(t=>/clear|search/i.test(t.tid)))}`); return s; };

  await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(9000);
  // make sure we start clean
  const cf = p.locator('[data-test-id="clear_filters"]');
  if (await cf.count()) { await cf.first().click().catch(()=>{}); await p.waitForTimeout(3000); }
  await stage('A-clean');

  // 1. apply ONE status filter, verified
  await p.locator('[data-test-id="filter_chip_status"]').click({ timeout: 8000 });
  await p.waitForTimeout(2000);
  const picked = await p.evaluate(() => {
    const ms = [...document.querySelectorAll('.q-menu')]; const m = ms[ms.length - 1];
    if (!m) return { err: 'no menu' };
    const it = [...m.querySelectorAll('.q-item')].find(i => i.innerText.trim().toLowerCase() === 'approved');
    if (!it) return { err: 'no Approved item', items: [...m.querySelectorAll('.q-item')].map(i => i.innerText.trim()) };
    it.click(); return { clicked: it.innerText.trim() };
  });
  await p.waitForTimeout(3500); await p.keyboard.press('Escape'); await p.waitForTimeout(1500);
  const sFiltered = await stage('B-status-approved', { picked });

  // 2. open search and type something that DOES match -> proves the scanner sees page_search_clear
  await p.locator('[data-test-id="page_search_toggle"]').click({ timeout: 8000 }).catch(()=>{});
  await p.waitForTimeout(1500);
  await p.locator('[data-test-id="page_search_input"]').fill('a').catch(()=>{});
  await p.waitForTimeout(4000);
  const sMatch = await stage('C-search-matching');   // CONTROL: page_search_clear must be visible here

  // 3. now a term that matches nothing -> the state C38897 step 2 describes
  await p.locator('[data-test-id="page_search_input"]').fill('zzzznomatchqqq').catch(()=>{});
  await p.waitForTimeout(4500);
  const sEmpty = await stage('D-search-no-match');
  await p.screenshot({ path: `${OUT}/empty-state-filter-plus-search.png` }).catch(()=>{});

  // 4. and with NO filter, only a non-matching search, to see if the message differs
  const cf2 = p.locator('[data-test-id="clear_filters"]');
  if (await cf2.count()) { await cf2.first().click().catch(()=>{}); await p.waitForTimeout(4000); }
  const sEmpty2 = await stage('E-search-only-no-match');
  await p.screenshot({ path: `${OUT}/empty-state-search-only.png` }).catch(()=>{});

  // ---- the rule-out, stated explicitly ----
  const seen = (s, t) => s.tids.some(x => x.tid === t);
  R.ruleout = {
    scanner_saw_page_search_clear_in_matching_state: seen(sMatch, 'page_search_clear'),
    scanner_saw_page_search_clear_in_empty_state: seen(sEmpty, 'page_search_clear'),
    empty_state_buttons: sEmpty.empty_block ? sEmpty.empty_block.buttons : null,
    empty_state_text_with_filter_and_search: sEmpty.empty_block ? sEmpty.empty_block.painted : null,
    empty_state_text_with_search_only: sEmpty2.empty_block ? sEmpty2.empty_block.painted : null,
    verdict_note: 'An absence is only meaningful if the FIRST line above is true.'
  };
  console.log('\n=== RULE-OUT ===\n' + JSON.stringify(R.ruleout, null, 1));
  R.bridge_errors = h.bridgeErrors;
  fs.writeFileSync(`${OUT}/empty-state.json`, JSON.stringify(R, null, 1));
  console.log('\nbridge_errors:', h.bridgeErrors.length);
  await h.browser.close();
})();
