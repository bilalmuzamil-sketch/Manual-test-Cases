// Which icon does each row type carry? The first read looked only for text inside .search-row__tile
// and came back null, which proves nothing about whether an icon is drawn.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
await P.openPalette(b.page, 'click');
await P.type(b.page, 'Fibridge', 3600);
const out = await b.page.evaluate(() => {
  const t = e => ((e && e.innerText) || '').replace(/\s+/g, ' ').trim();
  return [...document.querySelectorAll('.search-group')].map(g => {
    const r = g.querySelector('.search-row');
    const tile = r && (r.querySelector('.search-row__tile') || r.firstElementChild);
    return { group: t(g.querySelector('.search-group__header')),
             // the first version truncated at 180 characters, which cut off the <path d=...> that actually
             // distinguishes one icon from another - every group then hashed identically
             tileHTML: tile ? tile.innerHTML : null,
             tileText: t(tile), tileCls: tile ? String(tile.className).slice(0, 80) : null };
  });
});
for (const r of out) console.log(`${(r.group || '?').padEnd(26)} icon=${JSON.stringify(r.tileText)}  html=${(r.tileHTML || '').slice(0, 90)}`);
fs.writeFileSync('probe-icons.json', JSON.stringify(out, null, 1));
await b.browser.close();
