// Rule 104: before saying "there is no pinned row", prove the instrument could have seen one.
// The part-1 detector only looked for `.search-row` outside a `.search-group`. A pinned row built
// from a different element would be invisible to it, so here we dump the modal's real structure.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const out = {};
for (const q of ['S2-15430', 'S2-33692', 'PERTAB-7001', '1FUJGLDR9CLBP8834']) {
  await P.openPalette(b.page, 'click');
  await P.type(b.page, q, 3400);
  out[q] = await b.page.evaluate(() => {
    const m = document.querySelector('.search-modal'); if (!m) return { open: false };
    const txt = e => (e.innerText || '').replace(/\s+/g, ' ').trim();
    const walk = (el, d = 0) => {
      const kids = [...el.children];
      return kids.map(c => ({
        d, tag: c.tagName.toLowerCase(), cls: c.className && String(c.className).slice(0, 90),
        test: c.getAttribute('data-testid'),
        text: txt(c).slice(0, 80),
        kids: d < 3 ? walk(c, d + 1) : undefined,
      }));
    };
    const body = m.querySelector('.search-modal__body, .q-card') || m;
    return {
      open: true,
      // every class name anywhere in the modal - a "pinned"/"top hit" class would show here
      allClasses: [...new Set([...m.querySelectorAll('*')].flatMap(e => String(e.className || '').split(/\s+/)))]
                    .filter(Boolean).sort(),
      testids: [...new Set([...m.querySelectorAll('[data-testid]')].map(e => e.getAttribute('data-testid')))],
      tree: walk(body),
    };
  });
  const cls = out[q].allClasses || [];
  console.log(`== ${q}`);
  console.log('   pin-ish classes:', cls.filter(c => /pin|top|hit|exact|best|feature|highlight/i.test(c)).join(', ') || '(none)');
  console.log('   testids:', (out[q].testids || []).slice(0, 14).join(', '));
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(600);
}
fs.writeFileSync('probe-pin.json', JSON.stringify(out, null, 1));
await b.browser.close();
