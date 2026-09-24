export const APP='https://app.shopview.com';
export async function openPartsTab(page, wo) {
  await page.goto(`${APP}/workorders/${wo}/part-requests`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(10000);
  if (/totaled|404/.test(await page.evaluate(()=>document.body.innerText))) {
    await page.goto(`${APP}/workorders/${wo}/lines`, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(9000);
    await page.evaluate(() => { const t=[...document.querySelectorAll('[role=tab], .q-tab, a, button')].find(e=>/^Parts \(\d+\)$/.test((e.innerText||'').trim())); if (t) t.click(); });
    await page.waitForTimeout(9000);
  }
}
export async function readParts(page) {
  return await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(tr=>{
    const txt=(tr.innerText||'').replace(/\s+/g,' ').trim();
    const m = txt.match(/Description ([^\n]*?) arrow_drop_down/);
    return { name: m? m[1].trim() : txt.slice(0,40),
      badges:[...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()),
      actions:[...tr.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(x=>x&&x!=='expand_less'&&x!=='arrow_drop_down') };
  }).filter(r=>r.badges.length || /Description/.test(r.name)));
}
// Press a named action on the row whose description matches
export async function actOnPart(page, name, action) {
  const r = await page.evaluate(([n, a]) => {
    for (const tr of document.querySelectorAll('tbody tr')) {
      const txt = (tr.innerText||'').replace(/\s+/g,' ');
      if (!txt.includes(n)) continue;
      const b = [...tr.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width).find(x=>(x.innerText||'').trim()===a);
      if (b) { b.click(); return 'pressed ' + a + ' on ' + n; }
      return 'row found but no ' + a + ' - it offers: ' + [...tr.querySelectorAll('button,.q-btn')].map(x=>(x.innerText||'').trim()).filter(Boolean).join('|');
    }
    return 'no row matching ' + n;
  }, [name, action]);
  return r;
}

// Press the first row that offers this action, whatever the row is called.
export async function actOnFirst(page, action) {
  return await page.evaluate((a) => {
    for (const tr of document.querySelectorAll('tbody tr')) {
      const b = [...tr.querySelectorAll('button,.q-btn')].filter(x=>x.getBoundingClientRect().width).find(x=>(x.innerText||'').trim()===a);
      if (b) { b.click(); return 'pressed ' + a + ' on: ' + (tr.innerText||'').replace(/\s+/g,' ').slice(0,60); }
    }
    return 'no row offers ' + a;
  }, action);
}
export async function confirmDialog(page, words = /^(Yes|Confirm|OK|Continue|Save|Order|Place Order|Pick|Return|Receive)$/i) {
  const d = await page.evaluate(()=>{ const x=[...document.querySelectorAll('.q-dialog')].filter(e=>e.getBoundingClientRect().width)[0];
    return x? {text:(x.innerText||'').replace(/\s+/g,' ').slice(0,400), buttons:[...x.querySelectorAll('button,.q-btn')].map(b=>(b.innerText||'').trim()).filter(Boolean)}:null; });
  if (!d) return { dialog: null, pressed: null };
  const pressed = await page.evaluate((src)=>{ const re=new RegExp(src.slice(1, src.lastIndexOf('/')), 'i');
    const x=[...document.querySelectorAll('.q-dialog')].filter(e=>e.getBoundingClientRect().width)[0];
    const b=[...x.querySelectorAll('button,.q-btn')].find(y=>re.test((y.innerText||'').trim()));
    if (!b) return null; b.click(); return (b.innerText||'').trim(); }, words.toString());
  return { dialog: d, pressed };
}
