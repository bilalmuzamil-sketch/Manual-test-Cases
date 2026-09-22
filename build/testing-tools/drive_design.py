#!/usr/bin/env python3
"""Drive a design/prototype HTML with the pre-installed Chromium (no browser download).
Usage: python3 drive_design.py <file-or-url> <out-dir> [click-texts...]
Reusable design-exploration tool (Rule 115: the design MUST be driven, not skimmed)."""
import sys, time, pathlib
from playwright.sync_api import sync_playwright
CHROME="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
target=sys.argv[1]; out=pathlib.Path(sys.argv[2]); out.mkdir(parents=True,exist_ok=True)
clicks=sys.argv[3:]
url=target if target.startswith(("http","file:")) else "file://"+str(pathlib.Path(target).resolve())
def snap(page,name):
    page.wait_for_timeout(700)
    page.screenshot(path=str(out/f"{name}.png"), full_page=True)
    txt=page.evaluate("() => document.body.innerText")
    (out/f"{name}.txt").write_text(txt)
    print(f"[{name}] screenshot+text saved; text {len(txt)} chars")
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=CHROME, args=["--no-sandbox","--disable-gpu"])
    pg=b.new_page(viewport={"width":1440,"height":2200})
    pg.goto(url, wait_until="networkidle", timeout=60000)
    pg.wait_for_timeout(1500)
    snap(pg,"00-initial")
    # enumerate clickable text once
    labels=pg.evaluate("""() => Array.from(document.querySelectorAll('button,[role=button],a,[role=tab],[role=switch]'))
        .map(e=>(e.innerText||e.getAttribute('aria-label')||'').trim()).filter(Boolean).slice(0,120)""")
    (out/"clickables.txt").write_text("\n".join(labels))
    print("clickable labels:", len(labels))
    i=1
    for t in clicks:
        try:
            loc=pg.get_by_text(t, exact=False).first
            loc.scroll_into_view_if_needed(timeout=5000)
            loc.click(timeout=5000)
            snap(pg, f"{i:02d}-click-{t.replace(' ','_')[:24]}")
        except Exception as e:
            print(f"click '{t}' FAILED: {e}")
        i+=1
    b.close()
