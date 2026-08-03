// nav_map.mjs — capture the reports navigation structure (group headings + entry labels + hrefs)
// live from the sv8582 QA branch. Read-only. Output: evidence/nav-map.json + a screenshot.
import fs from 'fs';
import { boot } from './boot8582.mjs';
import { APP } from './qa8582.mjs';

const OUT = new URL('../evidence/', import.meta.url).pathname;
const { browser, page, netlog } = await boot('admin');
await page.goto(APP + '/reports', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(8000);

// Walk the reports side-nav in DOM order so group headings and their entries stay associated.
const nav = await page.evaluate(() => {
  const out = [];
  // find the container holding the report links
  const links = Array.from(document.querySelectorAll('a[href*="/reports/"]'));
  if (!links.length) return { error: 'no report links found' };
  let root = links[0].parentElement;
  for (let i = 0; i < 8 && root; i++) {
    if (root.querySelectorAll('a[href*="/reports/"]').length === links.length) break;
    root = root.parentElement;
  }
  const walk = el => {
    for (const child of el.children) {
      const a = child.matches('a[href*="/reports/"]') ? child : null;
      if (a) {
        out.push({ kind: 'link', label: a.innerText.trim().split('\n').filter(s => s && !/^[a-z_0-9]+$/.test(s)).join(' ') || a.innerText.trim(), raw: a.innerText.trim().replace(/\n/g, '|'), href: a.getAttribute('href') });
      } else if (child.querySelector && child.querySelector('a[href*="/reports/"]')) {
        walk(child);
      } else {
        const t = (child.innerText || '').trim();
        if (t && t.length < 60 && !t.includes('\n')) out.push({ kind: 'heading', label: t });
      }
    }
  };
  walk(root);
  return { items: out, total: links.length };
});

fs.writeFileSync(OUT + 'nav-map.json', JSON.stringify(nav, null, 2));
console.log(JSON.stringify(nav, null, 1));
await page.screenshot({ path: OUT + 'nav-reports-sidebar.png', fullPage: true });
await browser.close();
