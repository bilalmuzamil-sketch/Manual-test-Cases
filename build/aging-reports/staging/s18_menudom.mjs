// s18_menudom.mjs — 14 Nov 2026, staging, read-only: what a Customer-menu row is made of (tag/class chain from the row text up to the menu), and
// the scroll box, so the long-name menu tests can find rows. Opens A/R Summary > Customer chip.
import { stgStart } from './stglib.mjs';
const s = await stgStart(new URL('./s18/', import.meta.url).pathname); const p = s.page; await s.go('/reports/ar-aging-summary'); await p.waitForTimeout(4000);
await p.locator('main button', { hasText: /Customer:/ }).first().click(); await p.waitForTimeout(2000);
const o = await p.evaluate(() => { const menu = [...document.querySelectorAll('.q-menu')].pop(); const w = document.createTreeWalker(menu, NodeFilter.SHOW_TEXT); let n, node = null; while ((n = w.nextNode())) if (/American Heavy|Amesbury/.test(n.textContent)) { node = n.parentElement; break; }
  const chain = []; for (let e = node; e && e !== menu; e = e.parentElement) chain.push(e.tagName + '.' + [...e.classList].join('.') + (e.getAttribute('role') ? '[role=' + e.getAttribute('role') + ']' : ''));
  const scrollers = [menu, ...menu.querySelectorAll('*')].filter((x) => x.scrollHeight > x.clientHeight + 20).map((x) => [x.tagName + '.' + [...x.classList].join('.'), x.scrollHeight, x.clientHeight, getComputedStyle(x).overflowY]);
  return { chain, scrollers, rowHTML: node ? node.closest('[class]')?.parentElement?.outerHTML.slice(0, 600) : null }; });
console.log(JSON.stringify(o).slice(0, 3000)); await s.close(); process.exit(0);
