#!/usr/bin/env python3
"""Rule 99(g): do the test browser and this machine agree on a zone's UTC offset?

Two clocks can share a zone NAME and still disagree: the bundled Chromium carries
its own time-zone rules, which can be older than the machine's tz database (and
the server's). Proven 6 Nov 2026: Chromium 153 puts America/Edmonton at UTC-7
after 1 Nov 2026; tz database 2026e (machine and server) puts it at UTC-6.

Usage:
  python3 build/testing-tools/tz_rules_check.py America/Edmonton Pacific/Fiji \
      [--from 2026-11-01] [--to 2027-04-30]

For each zone, it prints MATCH or MISMATCH, and for a mismatch the date window
and both offsets. Exit code 1 if any zone mismatches.
Paste the output into the run's evidence. The server's offset is a third
reading: record it separately (Rule 99(g)).
"""
import argparse, datetime, json, os, subprocess, sys, tempfile
from zoneinfo import ZoneInfo

PLAYWRIGHT = '/opt/node22/lib/node_modules/playwright/index.js'

JS = r"""
const { chromium } = require(process.env.PW);
(async () => {
  const [zones, start, days] = JSON.parse(process.env.ARGS);
  const b = await chromium.launch();
  const p = await (await b.newContext()).newPage();
  const out = await p.evaluate(([zones, start, days]) => {
    const res = {};
    for (const z of zones) {
      const arr = [];
      for (let i = 0; i < days; i++) {
        const t = new Date(start + i * 86400000);
        // offset in minutes east of UTC, from the browser's own rules
        const parts = new Intl.DateTimeFormat('en-US', { timeZone: z, hourCycle: 'h23',
          year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
          .formatToParts(t).reduce((a, x) => (a[x.type] = x.value, a), {});
        const local = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
        arr.push(Math.round((local - t.getTime()) / 60000));
      }
      res[z] = arr;
    }
    return { ua: navigator.userAgent, res };
  }, [zones, start, days]);
  console.log(JSON.stringify(out));
  await b.close();
})();
"""


def fmt(m):
    s = '+' if m >= 0 else '-'
    return f"UTC{s}{abs(m)//60}" + (f":{abs(m)%60:02d}" if m % 60 else '')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('zones', nargs='+')
    ap.add_argument('--from', dest='frm', default=datetime.date.today().isoformat())
    ap.add_argument('--to', default=None)
    a = ap.parse_args()
    d0 = datetime.date.fromisoformat(a.frm)
    d1 = datetime.date.fromisoformat(a.to) if a.to else d0 + datetime.timedelta(days=180)
    days = (d1 - d0).days + 1
    start = datetime.datetime(d0.year, d0.month, d0.day, 12, tzinfo=datetime.timezone.utc)
    with tempfile.NamedTemporaryFile('w', suffix='.cjs', delete=False) as f:
        f.write(JS)
        js = f.name
    env = dict(os.environ, PW=PLAYWRIGHT,
               ARGS=json.dumps([a.zones, int(start.timestamp() * 1000), days]))
    out = json.loads(subprocess.check_output(['node', js], env=env, text=True))
    os.unlink(js)
    tzver = 'unknown'
    if os.path.exists('/usr/share/zoneinfo/tzdata.zi'):
        tzver = open('/usr/share/zoneinfo/tzdata.zi').readline().strip().lstrip('# ')
    print(f"browser: {out['ua'].split(' ')[-2]} | machine tz database: {tzver} | "
          f"dates {d0}..{d1} (noon UTC samples)")
    bad = False
    for z in a.zones:
        zi = ZoneInfo(z)
        runs, cur = [], None
        for i, bm in enumerate(out['res'][z]):
            t = start + datetime.timedelta(days=i)
            mm = int(t.astimezone(zi).utcoffset().total_seconds() // 60)
            if bm != mm:
                if cur and cur[2] == bm and cur[3] == mm:
                    cur[1] = t.date()
                else:
                    cur = [t.date(), t.date(), bm, mm]
                    runs.append(cur)
            else:
                cur = None
        if runs:
            bad = True
            for r in runs:
                print(f"MISMATCH {z}: {r[0]}..{r[1]} browser {fmt(r[2])} vs machine {fmt(r[3])}")
        else:
            print(f"MATCH    {z}")
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
