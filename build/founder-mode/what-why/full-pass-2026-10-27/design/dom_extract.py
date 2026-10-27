"""Extract every visible text node and every icon from each board file, with its computed look (for the text and visual inventories)."""
import json, os, sys
from playwright.sync_api import sync_playwright
BOARDS = [("1.1", "DialogBefore", "New Line - before"), ("1.2", "Main", "New Line - after"), ("1.3", "QuickBooks", "What reaches QuickBooks"),
          ("1.4", "EditBefore", "Edit Line - before"), ("1.5", "EditAfter", "Edit Line - after"), ("2.1", "EdgeCases", "Awkward inputs"),
          ("2.2", "Truncation", "The long end")]
JS = r"""() => {
 const out = []; const W = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
 let n; while ((n = W.nextNode())) { const t = n.textContent.replace(/\s+/g,' ').trim(); if (!t) continue;
  const e = n.parentElement; if (['STYLE','SCRIPT','TITLE'].includes(e.tagName)) continue; const s = getComputedStyle(e); const r = e.getBoundingClientRect();
  if (r.width < 1) continue;
  let bg = 'transparent', a = e; while (a) { const b = getComputedStyle(a).backgroundColor; if (b && b !== 'rgba(0, 0, 0, 0)') { bg = b; break; } a = a.parentElement; }
  out.push({text: t, tag: e.tagName.toLowerCase(), size: s.fontSize, weight: s.fontWeight, color: s.color, bg, transform: s.textTransform, family: s.fontFamily.split(',')[0], x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height)}); }
 const icons = [...document.querySelectorAll('svg')].map(v => { const r = v.getBoundingClientRect(); return {kind: v.querySelector('polyline') ? 'chevron-down' : (v.querySelectorAll('line').length === 2 ? 'close-x' : 'other'), stroke: v.getAttribute('stroke'), size: Math.round(r.width), x: Math.round(r.left), y: Math.round(r.top)}; });
 const boxes = [...document.querySelectorAll('div')].filter(d => { const s = getComputedStyle(d); return s.borderTopStyle !== 'none' || s.borderBottomStyle !== 'none' || (s.backgroundColor !== 'rgba(0, 0, 0, 0)'); }).map(d => { const s = getComputedStyle(d); const r = d.getBoundingClientRect(); return {text: d.innerText.replace(/\s+/g,' ').trim().slice(0, 60), bg: s.backgroundColor, border: s.borderTopWidth + ' ' + s.borderTopStyle + ' ' + s.borderTopColor, borderBottom: s.borderBottomWidth + ' ' + s.borderBottomColor, radius: s.borderRadius, x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height)}; });
 return {texts: out, icons, boxes}; }"""
res = {}
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1440, "height": 900})
    for num, f, title in BOARDS:
        pg.goto("file://" + os.path.abspath(f"inventory/boards/{f}.dc.html")); pg.wait_for_timeout(1200)
        d = pg.evaluate(JS); d.update(board=num, file=f + ".dc.html", title=title); res[num] = d
    b.close()
json.dump(res, open("inventory/dom-extract-2026-10-27.json", "w"), indent=1, ensure_ascii=False)
print({k: (len(v["texts"]), len(v["icons"]), len(v["boxes"])) for k, v in res.items()})
