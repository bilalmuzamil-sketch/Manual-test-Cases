// All 110 cases to disk, with the exact term each one tells the tester to type.
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'fs';
const strip = h => (h || '').replace(/<[^>]+>/g, '\n').replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'")
  .replace(/&ldquo;|&rdquo;/g,'"').replace(/&mdash;/g,'-').replace(/&gt;/g,'>').replace(/&lt;/g,'<')
  .replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/\n+/g,'\n').trim();
const rows = JSON.parse(fs.readFileSync('folder-19387.json', 'utf8')).rows;
const out = [];
for (const r of rows) {
  const { body } = await api(`get_case/${r.case_id}`);
  const pre = strip(body.custom_preconds), steps = strip(body.custom_steps), exp = strip(body.custom_expected);
  const m = /TYPE THIS INTO THE SEARCH BOX[^\n]*\n([^\n]+)/.exec(pre);
  out.push({ ...r, preconds: pre, steps, expected: exp, term: m ? m[1].trim() : null });
}
fs.writeFileSync('cases-110.json', JSON.stringify(out, null, 1));
const terms = {};
for (const c of out) { const t = c.term || '(none stated)'; (terms[t] ||= []).push(c.case_id); }
console.log('distinct terms the cases tell the tester to type:', Object.keys(terms).length);
for (const [t, ids] of Object.entries(terms).sort((a, b) => b[1].length - a[1].length))
  console.log(`   ${JSON.stringify(t).padEnd(34)} ${ids.length} case(s)`);
