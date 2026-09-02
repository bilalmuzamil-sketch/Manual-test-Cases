// PROBE SAFETY LIBRARY — every recorded build-reading mistake, encoded so it cannot recur.
//
// WHY THIS EXISTS. Between 2026-08-31 and 2026-09-02 five findings were reported to the QA lead that
// were wrong, and every one came from HOW the build was read, not from what the build did:
//
//   1. "Work order printed history"  <- tr.innerText glued a clock icon's text onto a cell's label,
//      and a wording divergence was raised on the phantom word.                     -> readCell/readLabel
//   2. "Fee & Discount"              <- a label copied from an old note instead of the screen; the
//      label gate then flagged 42 CORRECT cases.                                    -> (see verify_suite.py)
//   3. category read as ""           <- innerText on an <input>, whose text is not its value.   -> readLabel
//   4. "every part is on a bin"      <- read from the STOCKED parts endpoint when the question was
//      about the catalogue; and "no customer on 100 work orders" from a field name that does not
//      exist in the payload.                                                        -> requireFields
//   5. "the endpoint returned 200"   <- /api/... on the APP host answers 200 with the single-page
//      app's HTML shell; and ?page=/?limit= are silently ignored, so a paging loop re-reads page 1
//      for ever and calls it the whole population.                          -> getJson / fetchAllPages
//
// Import these instead of hand-rolling. Each one refuses rather than returning a plausible lie.

// ---------------------------------------------------------------- labels

/** Text of ONE element, with icon-bearing children removed first, and `value` used for form controls.
 *  Run inside page.evaluate. Never pass a row, card, dialog or body here. */
export const READ_LABEL_FN = `(el) => {
  if (!el) return null;
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return el.value;
  const c = el.cloneNode(true);
  c.querySelectorAll('svg, i, [class*="icon"], [class*="Icon"], [aria-hidden="true"]').forEach(n => n.remove());
  return (c.textContent || '').replace(/\\s+/g, ' ').trim();
}`;

/** Every row of a table as {header: cellLabel}. Columns come from the header row, so a value can
 *  never be attributed to the wrong field, and each cell is read with READ_LABEL_FN. */
export const READ_TABLE_FN = `(table) => {
  if (!table) return null;
  const label = ${READ_LABEL_FN};
  const heads = [...table.querySelectorAll('thead th, thead td')].map(label);
  return [...table.querySelectorAll('tbody tr')].map(tr =>
    Object.fromEntries([...tr.cells].map((c, i) => [heads[i] ?? ('col' + i), label(c)])));
}`;

/** THROWS if a label looks like two strings glued together, which is the tell of a container read.
 *  "Work order printed history" trips this; "Work order printed" does not. */
export function assertLabelSane(label, context = '') {
  if (label == null) throw new Error(`label is null ${context}`);
  const s = String(label);
  if (/\S\s{2,}\S/.test(s)) throw new Error(`label has internal double-space, likely two elements glued: ${JSON.stringify(s)} ${context}`);
  if (s.length > 60) throw new Error(`label is ${s.length} chars, far too long to be a label - a container was read: ${JSON.stringify(s.slice(0, 80))} ${context}`);
  if (/\$\d|\d{4,}/.test(s)) throw new Error(`label contains data (a money amount or a long number), so a value cell was included: ${JSON.stringify(s)} ${context}`);
  return s;
}

// ---------------------------------------------------------------- API reads

/** A 200 whose body is the single-page app's HTML is NOT an answer. Throws instead of returning it.
 *  Run the returned function inside page.evaluate so cookies apply. */
export const GET_JSON_FN = `async (url) => {
  const r = await fetch(url, { credentials: 'include', headers: { Accept: 'application/json' } });
  const t = await r.text();
  if (/^\\s*<!doctype/i.test(t))
    return { __error: 'SPA_SHELL', status: r.status, hint: 'this is the app host serving index.html - the API is on the <branch>api host', url };
  let j = null; try { j = JSON.parse(t); } catch (e) {
    return { __error: 'NOT_JSON', status: r.status, head: t.slice(0, 200), url };
  }
  return { __ok: true, status: r.status, json: j };
}`;

export function unwrap(res, what = 'request') {
  if (!res || res.__error) throw new Error(`${what} failed: ${JSON.stringify(res).slice(0, 300)}`);
  return res.json;
}

/** Refuses to read a field that is not in the payload. This is the check that would have stopped
 *  "0 of 2821 have a customer" AND "100 of 100 have no customer", which were the same bug twice. */
export function requireFields(record, fields, what = 'record') {
  const have = new Set(Object.keys(record || {}));
  const missing = fields.filter(f => !have.has(f));
  if (missing.length)
    throw new Error(`${what} has no field(s) ${JSON.stringify(missing)}. Present: ${[...have].join(', ')}`);
  return true;
}

/** Pages a list endpoint and PROVES the paging parameter works before trusting the total.
 *  Pass candidate param shapes; the first that returns a DIFFERENT first item on page 2 wins.
 *  If none does, it throws rather than reporting one page as the whole population. */
export async function fetchAllPages(page, { base, pick, idOf, shapes, pageSize = 500, cap = 200 }) {
  const call = async q => {
    const res = await page.evaluate(new Function('u', `return (${GET_JSON_FN})(u)`), base + q);
    return pick(unwrap(res, base + q));
  };
  let chosen = null;
  for (const shape of shapes) {
    const p1 = await call(shape(1, pageSize));
    const p2 = await call(shape(2, pageSize));
    if (Array.isArray(p1) && Array.isArray(p2) && p1.length && p2.length && idOf(p1[0]) !== idOf(p2[0])) {
      chosen = shape; break;
    }
  }
  if (!chosen) throw new Error(
    `no paging parameter shape changed the results - refusing to report one page as the whole set. ` +
    `Tried: ${shapes.map(s => s(2, pageSize)).join(' | ')}`);
  const all = new Map();
  for (let i = 1; i <= cap; i++) {
    const items = await call(chosen(i, pageSize));
    if (!Array.isArray(items) || !items.length) break;
    const before = all.size;
    for (const it of items) all.set(idOf(it), it);
    if (all.size === before) break;
    if (items.length < pageSize) break;
  }
  return { items: [...all.values()], shape: chosen(1, pageSize) };
}

/** The shapes actually observed on this product, most likely first. */
export const PAGING_SHAPES = [
  (p, n) => `?pagination[page]=${p}&pagination[rowsPerPage]=${n}`,
  (p, n) => `?page=${p}&limit=${n}`,
  (p, n) => `?page=${p}&per_page=${n}`,
  (p, n) => `?offset=${(p - 1) * n}&limit=${n}`,
];

// ---------------------------------------------------------------- negative results

/** A bundle/DOM search may only report a NEGATIVE if known-present control strings were all found.
 *  Measured 2026-09-02: a 400-chunk sweep missed "View mode" and "Tech view", which a screenshot
 *  proves exist; the same sweep at 611 chunks found them. Without controls, that run would have
 *  reported two real labels as absent. */
export function negativesAreTrustworthy(hits, controls) {
  const missed = controls.filter(c => !hits[c]);
  return { trustworthy: missed.length === 0, missedControls: missed };
}

/** Is this session actually signed in? A probe against the login page measures the login page. */
export function assertSignedIn(url) {
  if (/accounts\.google|\/login(\?|$)|sign-in/i.test(url))
    throw new Error(`not signed in - landed on ${url.slice(0, 120)}. Renew the cookies before probing.`);
  return true;
}
