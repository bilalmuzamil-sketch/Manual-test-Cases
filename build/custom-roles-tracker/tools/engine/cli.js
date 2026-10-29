#!/usr/bin/env node
// node cli.js <older.json> <newer.json>
//   | --prd-vs-impl <original.json> <latest.json> <impl.json> [ledger.json]
//   | --retest <change-report.json> <impl.json>
const fs = require('fs');
const E = require('./compare.js');
const a = process.argv.slice(2);
if (a[0] === '--prd-vs-impl') {
  const [o, l, i] = a.slice(1).map((f) => JSON.parse(fs.readFileSync(f)));
  const ledger = a[4] ? JSON.parse(fs.readFileSync(a[4])) : null;
  process.stdout.write(JSON.stringify(E.prdVsImpl(o, l, i, ledger), null, 1));
} else if (a[0] === '--retest') {
  const [r, i] = a.slice(1).map((f) => JSON.parse(fs.readFileSync(f)));
  process.stdout.write(JSON.stringify(E.retestPlan(r, i), null, 1));
} else {
  const [x, y] = a.map((f) => JSON.parse(fs.readFileSync(f)));
  process.stdout.write(JSON.stringify(E.compare(x, y), null, 1));
}
