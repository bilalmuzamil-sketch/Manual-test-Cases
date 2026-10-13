/* SV-11243 — run in the browser console on the work order page (S-1556), logged in to the customer's account.
   Step 1 (runs now): reads the work order's parts the same way the screen does and lists any part with an empty field.
   Step 2 (after you click Save & Close on the part): prints and stores the exact save the screen sent and the server's reply. */
(async () => {
  const PART_NUMBER = '920183';                       // the part the customer is editing
  const API = location.origin.replace('://app.', '://api.') + '/api';
  const get = async (p) => { const r = await fetch(API + p, { credentials: 'include' }); let j = null; try { j = await r.json(); } catch (e) {} return { status: r.status, json: j }; };
  const pick = (o, ks) => Object.fromEntries(ks.map((k) => [k, o?.[k]]));
  const m = location.pathname.match(/workorders\/([0-9a-f-]{36})/);
  if (!m) { console.warn('Open the work order first (S-1556, Lines tab), then run this again.'); return; }
  const wo = m[1];
  const REQUIRED = ['status', 'description', 'quantity', 'part_category_id'];
  const KEYS = ['id', 'part_number', 'description', 'name', 'status', 'status_val', 'part_category_id', 'quantity', 'quantity_remaining', 'staged_quantity',
    'part_source_type', 'inventory_part_id', 'catalogue_part_id', 'part_request_id', 'vendor_id', 'cost', 'sell_price', 'discount', 'core_charge', 'binAllocations', 'line_id'];
  const lines = await get('/work-orders/lines/' + wo);
  const coll = lines.json?.collection || lines.json?.data?.collection || [];
  const out = { workOrderId: wo, page: location.href, linesHttp: lines.status, lineCount: coll.length, lines: [], partsMatching: [], partsWithAnEmptyRequiredField: [] };
  for (const ln of coll) {
    out.lines.push({ line: ln.line_id, status: ln.status, parts: (ln.parts || []).length, requests: (ln.part_requests || []).length });
    for (const [kind, arr] of [['picked part', ln.parts || []], ['part request', ln.part_requests || []]]) {
      for (const p of arr) {
        const row = Object.assign({ kind, lineStatus: ln.status }, pick(p, KEYS));
        if (String(p.part_number || '').includes(PART_NUMBER)) out.partsMatching.push(row);
        const empty = REQUIRED.filter((k) => p[k] === null || p[k] === undefined);
        if (empty.length) out.partsWithAnEmptyRequiredField.push(Object.assign({ emptyFields: empty }, row));
      }
    }
  }
  const cats = await get('/parts-catalogue/categories-list');
  const cl = cats.json?.data?.collection || [];
  const def = cl.find((c) => c.isDefault);
  out.categories = { http: cats.status, count: cl.length, defaultCategory: def ? pick(def, ['id', 'name', 'label', 'isDefault']) : 'NONE FLAGGED AS DEFAULT' };
  const inv = await get('/inventory/parts?limit=25&search=' + encodeURIComponent(PART_NUMBER));
  out.inventoryMatches = (inv.json?.data?.collection || []).map((x) => pick(x, ['id', 'part_number', 'name', 'quantity', 'category', 'category_label', 'vendor_name', 'purchase_price', 'sell_price', 'catalogue_part_id', 'binLocations']));
  window.__sv11243report = out;
  if (!window.__sv11243hook) {
    window.__sv11243hook = true;
    const open = XMLHttpRequest.prototype.open, send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url) { this.__sv = { method, url: String(url) }; return open.apply(this, arguments); };
    XMLHttpRequest.prototype.send = function (body) {
      if (this.__sv && /parts\/change|part\/change-request|part\/make-request/.test(this.__sv.url)) {
        this.addEventListener('loadend', () => {
          const parse = (t) => { try { return JSON.parse(t); } catch (e) { return t; } };
          const rec = { url: this.__sv.url, httpStatus: this.status, payloadSent: parse(body), serverReply: parse(this.responseText) };
          (window.__sv11243saves = window.__sv11243saves || []).push(rec);
          console.log('%c SV-11243: SAVE CAPTURED ', 'color:#fff;background:#c00', rec);
          console.log('Copy everything below and send it to QA:\n' + JSON.stringify({ report: window.__sv11243report, saves: window.__sv11243saves }, null, 2));
        });
      }
      return send.apply(this, arguments);
    };
  }
  console.log('%c SV-11243 step 1 done ', 'color:#fff;background:#06c', out);
  console.log('Step 1 text to send to QA:\n' + JSON.stringify(out, null, 2));
  console.log('%cNow click the pencil next to part ' + PART_NUMBER + ' and click Save & Close. The save and the server reply will be printed here.', 'font-weight:bold');
})();
