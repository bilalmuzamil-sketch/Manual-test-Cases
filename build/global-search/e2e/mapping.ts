/**
 * THE TESTRAIL MAPPING — which case each test automates.
 *
 *     npm run mapping
 *
 * Writes `TESTRAIL-MAPPING.csv`: one row per case, naming the spec file, the test, and the exact
 * command that runs that case alone. Use it to set the automation fields in TestRail.
 *
 * 🔴 IT IS GENERATED FROM THE SUITE, NOT MAINTAINED BY HAND. A hand-kept list drifts the moment a
 * test is renamed or moved, and then it quietly says a case is automated when it is not — which is
 * worse than having no list, because TestRail will have been marked on the strength of it.
 *
 * 🔴 AND IT NAMES WHAT IS **NOT** AUTOMATED, WITH THE REASON. Two cases that passed in run 415 are
 * deliberately manual — a test for either would go red for its own reasons rather than the
 * product's. They appear in the CSV as `manual-only` precisely so nobody marks them automated by
 * reading the covered list and assuming the rest followed.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

/** Cases deliberately left to a human, with the reason, kept beside the code that excludes them. */
const MANUAL_ONLY: Record<string, string> = {
  C55715: 'The part is reachable only as a work-order line and the lists cap at 20, so even the '
        + 'correctly spelled query returned it on one run and not the next. A spec would go red for '
        + 'its own reasons. Run by hand against a record you have just created.',
  C53582: 'It types a town that dozens of records share, so the record it names is ranked out of a '
        + 'capped list. Absence there says nothing about the product. Run by hand.',
};

function main() {
  const raw = execFileSync('npx', ['playwright', 'test', '--list'], {
    encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, GS_APP: process.env.GS_APP || 'https://app.staging.shopview.com' },
  });

  type Row = { case_id: string; status: string; spec_file: string; line: string; test_name: string; run_just_this: string; note: string };
  const rows: Row[] = [];
  const seen = new Set<string>();

  for (const line of raw.split('\n')) {
    const m = /^\s*(\S+\.spec\.ts):(\d+):\d+ › (.*)$/.exec(line);
    if (!m) continue;
    const [, file, ln, title] = m;
    const ids = [...new Set([...title.matchAll(/@(C\d{5,6})/g)].map(x => x[1]))];
    const name = title.replace(/\s*@C\d{5,6}/g, '').trim();
    for (const cid of ids) {
      rows.push({ case_id: cid, status: 'automated', spec_file: file, line: ln, test_name: name,
                  run_just_this: `npx playwright test --grep "@${cid}"`, note: '' });
      seen.add(cid);
    }
  }
  for (const [cid, why] of Object.entries(MANUAL_ONLY)) {
    if (seen.has(cid)) continue;
    rows.push({ case_id: cid, status: 'manual-only', spec_file: '', line: '', test_name: '',
                run_just_this: '', note: why });
  }

  rows.sort((a, b) => Number(a.case_id.slice(1)) - Number(b.case_id.slice(1)));
  const esc = (v: string) => /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  const head = ['case_id', 'status', 'spec_file', 'line', 'test_name', 'run_just_this', 'note'];
  const csv = [head.join(','), ...rows.map(r => head.map(h => esc((r as any)[h] ?? '')).join(','))].join('\n');
  fs.writeFileSync('TESTRAIL-MAPPING.csv', csv + '\n');

  const automated = rows.filter(r => r.status === 'automated');
  const cases = new Set(automated.map(r => r.case_id));
  console.log(`TESTRAIL-MAPPING.csv written`);
  console.log(`  ${cases.size} cases automated across ${automated.length} tests`);
  console.log(`  ${rows.length - automated.length} deliberately manual, with the reason in the note column`);
}

main();
