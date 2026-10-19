/** probe-enrol-ui.mts — 19 Oct 2026, read-only, for C368131: which SCREEN removes a staff member's enrolment at a location? Greps the app's
 *  own JS chunks for "enrollment/remove" and prints the words around each hit (button labels, component names). Output EV/probe-enrol-ui.json. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { EV } from './wob.mts';
const { browser, page: p } = await open('/workorders');
const out: any = await p.evaluate(`(async () => { const app = ${JSON.stringify(APP)}; const TERM = ${JSON.stringify(process.env.TERM_Q || 'onClick:()=>k(')};
  const seen = new Set(); const queue = []; const hits = [];
  function add(s) { const u = s.startsWith('http') ? s : app + '/' + s.replace(/^\\.?\\//, ''); if (!seen.has(u)) { seen.add(u); queue.push(u); } }
  const html = await (await fetch(app + '/')).text(); for (const m of html.matchAll(/(?:src|href)="([^"]+\\.js)"/g)) add(m[1]);
  while (queue.length && seen.size < 1500) { const u = queue.shift(); let t = ''; try { t = await (await fetch(u)).text(); } catch (e) { continue; }
    for (const m of t.matchAll(/["'\`(\\/]((?:js|assets)\\/[A-Za-z0-9_.\\-]+\\.js)/g)) add(m[1]);
    let i = t.indexOf(TERM); while (i >= 0 && hits.length < 40) { hits.push({ file: u.replace(app, ''), around: t.slice(Math.max(0, i - 500), i + 400).replace(/\\s+/g, ' ') }); i = t.indexOf(TERM, i + 1500); } }
  return { files: seen.size, hits };
})()`);
fs.writeFileSync(path.join(EV, 'probe-enrol-ui.json'), JSON.stringify(out, null, 1)); console.log('ENROL files', out.files, 'hits', out.hits.length);
for (const h of out.hits) console.log('HIT', h.file, '::', h.around.slice(0, 900));
await done(browser);
