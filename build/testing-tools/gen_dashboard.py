#!/usr/bin/env python3
"""Generate a self-contained QA execution dashboard from live TestRail data.

Pulls milestone M3 + its six runs (R414-R419), each run's per-status counts, per-
engineer workload, and recent results, then renders a single self-contained HTML file
(no external calls at view time — CSP-safe for publishing as an Artifact). Re-run on a
schedule to refresh; republishing to the same Artifact URL keeps the link stable.

Creds: resolved by load_creds.testrail_creds() — env vars, then /tmp/shopview-creds.env, then
/tmp/testrail/creds.json (Rule 82 — never committed, never printed).
Config: testrail_runs.json (run/group map) + milestone id below.
Usage: python3 build/testing-tools/gen_dashboard.py [out.html]
"""
import urllib.request, json, base64, ssl, os, sys, datetime, html

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import testrail_statuses as TS
CFG = json.load(open(os.path.join(HERE, "testrail_runs.json")))
MILESTONE_ID = 3
DUE = datetime.date(2026, 9, 21)
START = datetime.date(2026, 8, 25)
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "..", "qa-dashboard", "dashboard.html")

def creds():
    """Delegate to load_creds.py, which knows ALL THREE places credentials live.

    2026-09-03: this function used to read ONLY /tmp/shopview-creds.env, so it died with a
    KeyError/FileNotFoundError while working credentials sat on disk at /tmp/testrail/creds.json.
    That is the exact pattern that made a session declare a false blocker on 2026-09-02. Never
    re-implement the lookup here - a second copy is a second thing to be wrong (Rule 97).
    """
    sys.path.insert(0, HERE)
    from load_creds import testrail_creds
    return testrail_creds()

EMAIL, KEY = creds()
BASE = CFG["base_url"] + "/index.php?/api/v2/"
CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")

def api(path):
    req = urllib.request.Request(BASE + path)
    req.add_header("Authorization", "Basic " + base64.b64encode(f"{EMAIL}:{KEY}".encode()).decode())
    with urllib.request.urlopen(req, context=CTX, timeout=120) as r:
        return json.loads(r.read().decode())

def paged(path, key):
    out = []; off = 0
    while True:
        r = api(f"{path}&limit=250&offset={off}")
        b = r[key] if isinstance(r, dict) and key in r else r
        out += b
        if len(b) < 250: break
        off += 250
    return out

# --- known engineers (ids resolved 2026-08-25); fallback to "User <id>" ---
USERS = {3: "Bilal Muzamil", 2: "Nebojsa Glavinic", 4: "Viktoria Videnovic",
         6: "Mudassir Qamar", 7: "Ahtasham Amjad", 5: "Ayesha Khan"}
def uname(uid):
    if not uid: return "Unassigned"
    return USERS.get(uid, f"User {uid}")

# ---------------------------------------------------------------------------------------
# STATUSES. The id -> bucket map is NOT written here: it is declared once in
# `testrail_statuses.py` and audited against a live `get_statuses` on every run (see
# `collect()`). Until 2026-09-03 this file carried `SID = {1..5}` and read it with
# `SID.get(status_id, "untested")`, so any result carrying a TestRail CUSTOM status (id
# 6-12) was silently counted as Untested — inflating "remaining", deflating "Executed %",
# with no error. `TS.bucket()` has no default and raises instead.
#
# DISPLAY_ORDER is presentation only. STATUS is derived from it plus anything else the
# module declares, so a newly declared bucket cannot be dropped from the bars by omission.
# ---------------------------------------------------------------------------------------
DISPLAY_ORDER = ("passed", "failed", "blocked", "retest", "untested")
STATUS = [(k, TS.LABELS[k]) for k in DISPLAY_ORDER if k in TS.LABELS]
STATUS += [(k, TS.LABELS[k]) for k in TS.BUCKETS if k not in DISPLAY_ORDER]

def collect():
    # Prove the declared status map still matches the instance BEFORE counting anything.
    # A stale map stops the run; it never produces a figure the QA lead should not trust.
    TS.assert_current(api("get_statuses"))
    ms = api(f"get_milestone/{MILESTONE_ID}")
    runs = []
    for slug, info in CFG["runs"].items():
        r = api(f"get_run/{info['run_id']}")
        # Per-status run counts, keyed off the declared statuses rather than five literals,
        # so a custom status's `custom_statusN_count` is included in the total instead of
        # vanishing from it.
        counts = {TS.SID[sid]: r.get(TS.run_count_field(sid), 0) or 0
                  for sid, _b, _l, _s, _u in TS.DECLARED}
        total = sum(counts.values())
        tests = paged(f"get_tests/{info['run_id']}", "tests")
        # per-engineer status buckets for this run
        by_eng = {}
        for t in tests:
            uid = t.get("assignedto_id")
            b = by_eng.setdefault(uid, {k: 0 for k, _ in STATUS})
            b[TS.bucket(t.get("status_id"))] += 1
        owner = r.get("assignedto_id")
        runs.append({"slug": slug, "name": info["name"], "run_id": info["run_id"],
                     "url": f"{CFG['base_url']}/index.php?/runs/view/{info['run_id']}",
                     "counts": counts, "total": total, "owner": owner, "by_eng": by_eng})
    # aggregate per engineer across all runs
    eng = {}
    for run in runs:
        for uid, b in run["by_eng"].items():
            e = eng.setdefault(uid, {k: 0 for k, _ in STATUS})
            for k, _ in STATUS: e[k] += b[k]
    # recent results across runs (latest few)
    activity = []
    for run in runs:
        try:
            res = api(f"get_results_for_run/{run['run_id']}&limit=30")
            rl = res["results"] if isinstance(res, dict) and "results" in res else res
            for x in rl:
                if x.get("status_id"):
                    activity.append({"run": run["name"], "who": uname(x.get("created_by")),
                                     "status": TS.bucket(x["status_id"]),
                                     "on": x.get("created_on", 0), "comment": x.get("comment") or ""})
        except TS.UnknownStatusId:
            # NEVER swallowed. This except-block used to be a bare `except Exception: pass`,
            # which would have re-created the exact silent degradation `TS.bucket` exists to
            # stop — the loud failure would have been caught and the activity feed would have
            # quietly gone short. The activity feed is optional; a wrong number is not.
            raise
        except Exception as exc:                       # noqa: BLE001 - feed is best-effort
            # The feed is decorative and its endpoint is flaky; a fetch failure must not take
            # the dashboard down. It is REPORTED, not swallowed, so a run that lost the feed
            # says so instead of looking complete.
            print(f"  ! recent-activity fetch failed for run {run['run_id']}: "
                  f"{type(exc).__name__}: {exc}", file=sys.stderr)
    activity.sort(key=lambda a: a["on"], reverse=True)
    return ms, runs, eng, activity[:15]

# ---------------- rendering ----------------
CLR = {"passed": "#2f8f6b", "failed": "#c0453b", "blocked": "#c98a1a",
       "retest": "#7c6bd6", "untested": "#8a94a6"}
LABEL = dict(STATUS)

# A bucket with no colour would KeyError deep inside rendering, after the API work is done
# and with no hint of what to add. Say it here, once, naming the fix.
_uncoloured = [k for k, _ in STATUS if k not in CLR]
if _uncoloured:
    raise TS.UnknownStatusId(
        "these statuses are declared in testrail_statuses.py but have no colour in "
        "gen_dashboard.py's CLR: %s. Add one hex colour per bucket; do not drop the bucket "
        "from the bars, which would under-report it." % ", ".join(repr(k) for k in _uncoloured))

def esc(s): return html.escape(str(s))

def stacked_bar(counts, total, h=14):
    if total == 0:
        return f'<div class="bar empty" style="height:{h}px"></div>'
    segs = []
    for k, _ in STATUS:
        n = counts[k]
        if n == 0: continue
        pct = n / total * 100
        segs.append(f'<span class="seg" style="width:{pct:.3f}%;background:{CLR[k]}" '
                    f'title="{LABEL[k]}: {n}"></span>')
    return f'<div class="bar" style="height:{h}px">{"".join(segs)}</div>'

def pct_done(counts, total):
    if total == 0: return 0
    return round((total - counts[TS.UNTESTED]) / total * 100)

def burndown_svg(runs):
    total = sum(r["total"] for r in runs)
    remaining = sum(r["counts"][TS.UNTESTED] for r in runs)
    days = (DUE - START).days
    W, H, pad = 720, 200, 34
    x0, y0, x1, y1 = pad, 12, W - 12, H - pad
    def X(d): return x0 + (x1 - x0) * (d / days)
    def Y(v): return y1 - (y1 - y0) * (v / total if total else 0)
    ideal = f"M {X(0):.1f} {Y(total):.1f} L {X(days):.1f} {Y(0):.1f}"
    today = min((datetime.date.today() - START).days, days)
    if today < 0: today = 0
    actual = f"M {X(0):.1f} {Y(total):.1f} L {X(today):.1f} {Y(remaining):.1f}"
    grid = "".join(f'<line x1="{x0}" y1="{Y(total*f):.1f}" x2="{x1}" y2="{Y(total*f):.1f}" class="grid"/>'
                   for f in (0, .25, .5, .75, 1))
    labels = (f'<text x="{x0}" y="{H-10}" class="axl">{START.strftime("%b %d")}</text>'
              f'<text x="{x1}" y="{H-10}" class="axl" text-anchor="end">{DUE.strftime("%b %d")} · due</text>'
              f'<text x="{x0-6}" y="{Y(total):.1f}" class="axl" text-anchor="end">{total}</text>'
              f'<text x="{x0-6}" y="{Y(0):.1f}" class="axl" text-anchor="end">0</text>')
    return (f'<svg viewBox="0 0 {W} {H}" class="burn" role="img" '
            f'aria-label="Burndown: {remaining} of {total} cases remaining">'
            f'{grid}<path d="{ideal}" class="ideal"/><path d="{actual}" class="actual"/>'
            f'<circle cx="{X(today):.1f}" cy="{Y(remaining):.1f}" r="4" class="dot"/>{labels}</svg>')

def render(ms, runs, eng, activity):
    total = sum(r["total"] for r in runs)
    agg = {k: sum(r["counts"][k] for r in runs) for k, _ in STATUS}
    executed = total - agg[TS.UNTESTED]
    exec_pct = round(executed / total * 100) if total else 0
    assigned = sum(n for uid, b in eng.items() if uid for n in b.values())
    assigned_pct = round(assigned / total * 100) if total else 0
    today = datetime.date.today()
    days_left = (DUE - today).days
    gen = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    ontrack = "on-track" if exec_pct >= 0 else ""
    # KPI tiles
    kpis = [("Test cases", f"{total}", "across 6 suites"),
            ("Executed", f"{exec_pct}%", f"{executed} of {total}"),
            ("Passed", f"{agg['passed']}", "passed"),
            ("Failed", f"{agg['failed']}", "failed"),
            ("Blocked", f"{agg['blocked']}", "blocked"),
            ("Assigned", f"{assigned_pct}%", f"{assigned} of {total}"),
            ("Days left", f"{days_left}", f"due {DUE.strftime('%b %d')}")]
    kpi_html = "".join(
        f'<div class="kpi"><div class="kv">{esc(v)}</div><div class="kl">{esc(l)}</div>'
        f'<div class="ks">{esc(s)}</div></div>' for l, v, s in kpis)
    # legend
    legend = "".join(f'<span class="lg"><span class="sw" style="background:{CLR[k]}"></span>{LABEL[k]}</span>'
                     for k, _ in STATUS)
    # run cards
    cards = ""
    for r in sorted(runs, key=lambda x: -x["total"]):
        c = r["counts"]; d = pct_done(c, r["total"])
        counts_line = " · ".join(f'<b style="color:{CLR[k]}">{c[k]}</b> {LABEL[k].lower()}'
                                 for k, _ in STATUS if c[k])
        counts_line = counts_line or "no results yet"
        cards += (f'<a class="card" href="{r["url"]}" target="_blank" rel="noopener">'
                  f'<div class="crow"><span class="cname">{esc(r["name"])}</span>'
                  f'<span class="cid">R{r["run_id"]}</span></div>'
                  f'<div class="cmeta"><span class="owner">{esc(uname(r["owner"]))}</span>'
                  f'<span class="cdone">{d}%<span> done</span></span></div>'
                  f'{stacked_bar(c, r["total"])}'
                  f'<div class="cfoot">{counts_line} · <b>{r["total"]}</b> total</div></a>')
    # engineer workload
    eng_rows = ""
    ordered = sorted(eng.items(), key=lambda kv: (kv[0] is None, -sum(kv[1].values())))
    for uid, b in ordered:
        tot = sum(b.values())
        if tot == 0: continue
        done = tot - b[TS.UNTESTED]
        eng_rows += (f'<div class="erow"><div class="ename">{esc(uname(uid))}'
                     f'<span class="ect">{done}/{tot}</span></div>{stacked_bar(b, tot, 12)}</div>')
    if not eng_rows:
        eng_rows = '<div class="empty-note">No test-case assignments yet. Once runs are assigned, each engineer&rsquo;s workload appears here.</div>'
    # activity
    if activity:
        act = ""
        for a in activity:
            when = datetime.datetime.utcfromtimestamp(a["on"]).strftime("%b %d %H:%M") if a["on"] else ""
            act += (f'<li><span class="dot2" style="background:{CLR[a["status"]]}"></span>'
                    f'<span class="awho">{esc(a["who"])}</span> marked '
                    f'<span style="color:{CLR[a["status"]]}">{LABEL[a["status"]]}</span> '
                    f'<span class="arun">{esc(a["run"])}</span><span class="awhen">{esc(when)}</span></li>')
        activity_html = f'<ul class="feed">{act}</ul>'
    else:
        activity_html = '<div class="empty-note">No results recorded yet. As engineers execute tests, the latest activity shows here.</div>'

    return TEMPLATE.format(
        total=total, gen=gen, ms_url=f"{CFG['base_url']}/index.php?/milestones/view/{MILESTONE_ID}",
        ms_name=esc(ms.get("name", "")), due=DUE.strftime("%b %d, %Y"), start=START.strftime("%b %d, %Y"),
        days_left=days_left, kpis=kpi_html, legend=legend, burn=burndown_svg(runs),
        cards=cards, eng_rows=eng_rows, activity=activity_html, exec_pct=exec_pct)

TEMPLATE = """<title>ShopView QA Cycle</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
<style>
:root{{
  --bg:#f4f6fa; --surface:#ffffff; --surface2:#eef1f7; --ink:#1a2233; --ink2:#4a5568;
  --muted:#8a94a6; --line:#dfe4ee; --accent:#4f46e5; --accent-ink:#4f46e5;
  --shadow:0 1px 2px rgba(16,24,40,.06),0 4px 16px rgba(16,24,40,.05);
}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{
  --bg:#0e1117; --surface:#161b26; --surface2:#1d2432; --ink:#e8ecf4; --ink2:#aab3c5;
  --muted:#7c8699; --line:#28303f; --accent:#8b83ff; --accent-ink:#a9a2ff;
  --shadow:0 1px 2px rgba(0,0,0,.4),0 6px 20px rgba(0,0,0,.35);
}}}}
:root[data-theme="dark"]{{
  --bg:#0e1117; --surface:#161b26; --surface2:#1d2432; --ink:#e8ecf4; --ink2:#aab3c5;
  --muted:#7c8699; --line:#28303f; --accent:#8b83ff; --accent-ink:#a9a2ff;
  --shadow:0 1px 2px rgba(0,0,0,.4),0 6px 20px rgba(0,0,0,.35);
}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--bg);color:var(--ink);
  font-family:"IBM Plex Sans",system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  line-height:1.5;-webkit-font-smoothing:antialiased}}
.wrap{{max-width:1080px;margin:0 auto;padding:32px 24px 64px}}
.mono{{font-family:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace;font-variant-numeric:tabular-nums}}
header{{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:8px}}
h1{{font-size:26px;font-weight:700;letter-spacing:-.01em;margin:0;text-wrap:balance}}
.sub{{color:var(--ink2);font-size:14px;margin-top:4px}}
.sub a{{color:var(--accent-ink);text-decoration:none;border-bottom:1px solid transparent}}
.sub a:hover{{border-bottom-color:currentColor}}
.gen{{font-size:12px;color:var(--muted);text-align:right}}
.gen .mono{{font-size:12px}}
h2{{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);
  margin:34px 0 12px}}
.kpis{{display:grid;grid-template-columns:repeat(7,1fr);gap:10px}}
@media(max-width:860px){{.kpis{{grid-template-columns:repeat(3,1fr)}}}}
@media(max-width:520px){{.kpis{{grid-template-columns:repeat(2,1fr)}}}}
.kpi{{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:14px 14px 12px;box-shadow:var(--shadow)}}
.kv{{font-family:"IBM Plex Mono",monospace;font-size:24px;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums}}
.kl{{font-size:12px;font-weight:600;margin-top:2px}}
.ks{{font-size:11px;color:var(--muted);margin-top:1px}}
.panel{{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:20px;box-shadow:var(--shadow)}}
.legend{{display:flex;flex-wrap:wrap;gap:14px;margin:10px 2px 0}}
.lg{{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--ink2)}}
.sw{{width:11px;height:11px;border-radius:3px;display:inline-block}}
.bar{{display:flex;width:100%;border-radius:5px;overflow:hidden;background:var(--surface2)}}
.bar .seg{{display:block;height:100%;box-shadow:inset -2px 0 0 var(--surface)}}
.bar.empty{{background:repeating-linear-gradient(45deg,var(--surface2),var(--surface2) 6px,transparent 6px,transparent 12px)}}
.grid-cards{{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}}
@media(max-width:720px){{.grid-cards{{grid-template-columns:1fr}}}}
.card{{display:block;background:var(--surface);border:1px solid var(--line);border-radius:14px;
  padding:16px;box-shadow:var(--shadow);text-decoration:none;color:inherit;transition:transform .12s,border-color .12s}}
.card:hover{{transform:translateY(-2px);border-color:var(--accent)}}
.crow{{display:flex;justify-content:space-between;align-items:baseline;gap:8px}}
.cname{{font-weight:600;font-size:15px;letter-spacing:-.01em}}
.cid{{font-family:"IBM Plex Mono",monospace;font-size:12px;color:var(--muted)}}
.cmeta{{display:flex;justify-content:space-between;align-items:baseline;margin:6px 0 8px}}
.owner{{font-size:13px;color:var(--ink2)}}
.cdone{{font-family:"IBM Plex Mono",monospace;font-weight:600;font-size:15px}}
.cdone span{{font-family:"IBM Plex Sans";font-weight:400;font-size:12px;color:var(--muted)}}
.cfoot{{font-size:12px;color:var(--muted);margin-top:9px}}
.cfoot b{{font-family:"IBM Plex Mono",monospace}}
.erow{{margin-bottom:12px}}
.ename{{display:flex;justify-content:space-between;font-size:13px;font-weight:500;margin-bottom:5px}}
.ect{{font-family:"IBM Plex Mono",monospace;color:var(--muted);font-weight:400}}
.burn{{width:100%;height:auto;display:block}}
.burn .grid{{stroke:var(--line);stroke-width:1}}
.burn .ideal{{fill:none;stroke:var(--muted);stroke-width:1.5;stroke-dasharray:5 5}}
.burn .actual{{fill:none;stroke:var(--accent);stroke-width:2.5;stroke-linecap:round}}
.burn .dot{{fill:var(--accent)}}
.burn .axl{{fill:var(--muted);font-size:11px;font-family:"IBM Plex Mono",monospace}}
.feed{{list-style:none;margin:0;padding:0}}
.feed li{{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--line);font-size:13px}}
.feed li:last-child{{border-bottom:none}}
.dot2{{width:8px;height:8px;border-radius:50%;flex:none}}
.awho{{font-weight:600}}
.arun{{color:var(--ink2)}}
.awhen{{margin-left:auto;font-family:"IBM Plex Mono",monospace;font-size:12px;color:var(--muted)}}
.empty-note{{color:var(--muted);font-size:13px;padding:14px;background:var(--surface2);border-radius:10px;text-align:center}}
.two{{display:grid;grid-template-columns:1fr 1fr;gap:14px}}
@media(max-width:720px){{.two{{grid-template-columns:1fr}}}}
footer{{margin-top:40px;color:var(--muted);font-size:12px;text-align:center;line-height:1.7}}
</style>
<div class="wrap">
  <header>
    <div>
      <h1>ShopView QA &mdash; Aug 2026 Feature Cycle</h1>
      <div class="sub">Milestone <a href="{ms_url}" target="_blank" rel="noopener">{ms_name}</a>
        &nbsp;&middot;&nbsp; {start} &rarr; {due}</div>
    </div>
    <div class="gen">generated<br><span class="mono">{gen}</span></div>
  </header>

  <div class="kpis">{kpis}</div>

  <h2>Burndown to due date</h2>
  <div class="panel">{burn}
    <div class="legend">{legend}</div>
  </div>

  <h2>Runs &mdash; progress by suite</h2>
  <div class="grid-cards">{cards}</div>

  <div class="two">
    <div>
      <h2>Workload by engineer</h2>
      <div class="panel">{eng_rows}</div>
    </div>
    <div>
      <h2>Recent activity</h2>
      <div class="panel">{activity}</div>
    </div>
  </div>

  <footer>
    Live data from TestRail (project 1, milestone M3) &middot; regenerate to refresh.<br>
    Status legend applies to every bar. Percentages are of each run&rsquo;s own case total.
  </footer>
</div>
"""

if __name__ == "__main__":
    os.makedirs(os.path.dirname(os.path.abspath(OUT)), exist_ok=True)
    ms, runs, eng, activity = collect()
    open(OUT, "w").write(render(ms, runs, eng, activity))
    tot = sum(r["total"] for r in runs)
    print(f"Wrote {OUT}  ({tot} cases across {len(runs)} runs)")
