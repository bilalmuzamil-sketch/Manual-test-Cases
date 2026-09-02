// ROUTE REGISTRY — every UI route and the request it fires, recorded once and reused for ever.
//
// WHY (QA lead, 2026-09-02): "you should have a mechanism to auto keep on saving the paths so that
// when you have to do the same thing the next time you can do it quickly."
//
// WHAT IT IS FOR. Build verification needs preconditions and steps that are (a) NOT INVENTED,
// (b) build-verified, (c) runnable by a manual tester. A route in here satisfies all three at once:
// it was walked in a real browser, its on-screen labels were read off the smallest element that owns
// them, and the request it fired was captured from the network - so the tester's clicks and our
// evidence are the same thing.
//
// THE STORE is build/testing-tools/route_registry.json. Every entry carries its evidence: the branch,
// the build marker, the date, the exact click path in the build's own labels, and the API call fired.
// Never hand-edit it - append through record() so the shape stays uniform and nothing is invented.
import fs from 'fs';
import path from 'path';

const STORE = path.join(path.dirname(new URL(import.meta.url).pathname), 'route_registry.json');

export function load() {
  try { return JSON.parse(fs.readFileSync(STORE, 'utf8')); }
  catch (e) { return { version: 1, routes: [] }; }
}

/** Look a route up BEFORE probing for it. This is the whole point of the file. */
export function find(query) {
  const q = String(query).toLowerCase();
  return load().routes.filter(r =>
    [r.name, r.feature, r.ui_path, r.api, ...(r.labels || [])].join(' ').toLowerCase().includes(q));
}

/** Append a route. Refuses an entry that has no evidence - an unwitnessed route is a guess. */
export function record(entry) {
  const need = ['name', 'feature', 'branch', 'build', 'ui_path'];
  const missing = need.filter(k => !entry[k]);
  if (missing.length) throw new Error(`route needs ${JSON.stringify(missing)} - an entry without evidence is a guess`);
  if (!entry.api && !entry.download && !entry.screen)
    throw new Error('a route must record what it PRODUCED: an api call, a download, or the screen it landed on');
  const db = load();
  const key = r => `${r.feature}::${r.name}`;
  db.routes = db.routes.filter(r => key(r) !== key(entry));
  db.routes.push({ ...entry, recorded: entry.recorded || new Date().toISOString().slice(0, 10) });
  db.routes.sort((a, b) => (a.feature + a.name).localeCompare(b.feature + b.name));
  fs.writeFileSync(STORE, JSON.stringify(db, null, 1) + '\n');
  return db.routes.length;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [cmd, ...rest] = process.argv.slice(2);
  if (cmd === 'find') {
    const hits = find(rest.join(' '));
    if (!hits.length) { console.log('no route recorded for', JSON.stringify(rest.join(' '))); process.exit(1); }
    for (const r of hits) {
      console.log(`\n### ${r.feature} — ${r.name}`);
      console.log(`  clicks : ${r.ui_path}`);
      if (r.api) console.log(`  fires  : ${r.api}`);
      if (r.download) console.log(`  yields : a download named ${JSON.stringify(r.download)}`);
      if (r.labels) console.log(`  labels : ${r.labels.join(' · ')}`);
      console.log(`  proven : ${r.branch} ${r.build} on ${r.recorded}${r.evidence ? '  (' + r.evidence + ')' : ''}`);
      if (r.note) console.log(`  note   : ${r.note}`);
    }
  } else {
    const db = load();
    console.log(`${db.routes.length} route(s) recorded:`);
    for (const r of db.routes) console.log(`  ${r.feature.padEnd(26)} ${r.name.padEnd(34)} ${r.branch} ${r.recorded}`);
  }
}
