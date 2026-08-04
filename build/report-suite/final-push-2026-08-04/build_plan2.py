#!/usr/bin/env python3
"""
Report Suite FINAL PUSH 2026-08-04 — PASS 2.

Two additions from the QA lead, both idempotent, both leaving every assertion alone:

  T  THE TICKET LINE — for a case whose expected result the build currently breaches AND
     for which an OPEN ticket exists, one plain line goes below the expected items and
     directly above the provenance line.
     **Ticket status was verified LIVE in Jira on 2026-08-04 before any link was written**
     (`GET /rest/api/3/issue/<key>?fields=status,resolution`):
        SV-8818 Open · SV-8819 Open · SV-8820 Open            -> LINKED
        SV-8821 OBSOLETE/Done · SV-8822 OBSOLETE/Done ·
        SV-8823 OBSOLETE/Done                                 -> NOT LINKED
     Linking a closed/obsolete ticket as if it were an open fix would mislead a tester,
     so it is refused here and reported instead (Rule 12).

  P  THE TOOL LINE — the 56 cases the audit marked as needing a tool were never
     unrunnable; they simply never said WHAT to use. Each gets a plain precondition
     naming the tool and where to get it. Nothing here changes a step or an expectation.

Ordering inside custom_expected is fixed:
    <numbered expected items>
    Known issue: ... filed for a fix here: <url>          <- T, optional
    ---
    This is the expected behaviour as per the build tested on ...   <- the provenance line
"""
import json, os, re, sys, collections

HERE = os.path.dirname(os.path.abspath(__file__))
SEP = '---'
LEAD = 'This is the expected behaviour as per the build tested on'
KNOWN = 'Known issue: the product does not currently do this. It has been filed for a fix here: '
JIRA = 'https://shopview.atlassian.net/browse/'

# ── T: ticket -> cases.  Mapping taken from defect-pack-2026-08-04/CASE-IMPACT.md,
#    never guessed.  Only OPEN tickets appear here.
OPEN_TICKETS = {
    'SV-8818': [38885, 38887, 30593, 30595, 30172, 30194, 30290, 30320,
                43547, 43548],   # the two cases authored 2026-08-04 for this exact failure
    'SV-8819': [30367, 30374],
    'SV-8820': [30562, 30564, 30565, 30566],
}
# recorded for the report: cases whose defect has NO open ticket, and why
NO_TICKET = {
    'SV-8823 set to OBSOLETE by the QA lead': [30588, 30589],
    'SV-8821 set to OBSOLETE (reachable only through the back end, not by a user)':
        [30321, 30253, 30254, 30255, 30256, 30257, 30258, 30259, 30260,
         30151, 30229, 30230, 30231, 38894, 30314],
    'never filed — unbuilt default or styling drift, no ticket exists':
        [30554, 30503, 30536, 30574, 30597, 30519, 30596],
}

# ── P: tool text per category ────────────────────────────────────────────────
NETWORK = ('To see the information this test asks for you need the browser\'s own developer '
           'tools: press F12 (or Ctrl+Shift+I; on a Mac Cmd+Option+I) and open the "Network" '
           'tab, then reload the page. There is nothing to install — it is built into Chrome, '
           'Edge and Firefox.')
NETWORK_DB = (NETWORK + ' Where a check also asks you to confirm what is stored on the server, '
              'ask a developer to read it back for you — that part cannot be seen from the '
              'browser.')
OFFLINE = ('To force the failure this test needs, use the browser\'s own developer tools: press '
           'F12, open the "Network" tab, and switch the throttling dropdown (it normally reads '
           '"No throttling") to "Offline" to cut the connection, or to "Slow 3G" to slow it down. '
           'There is nothing to install. Set it back to "No throttling" when you finish.')
SCREENREADER = ('Part of this test checks what a blind user would hear, so you need a screen '
                'reader. On Windows install NVDA — it is free, from nvaccess.org. On a Mac use '
                'VoiceOver, which is already built in (Cmd+F5 turns it on and off). Alternatively '
                'the browser\'s developer tools (F12) have an "Accessibility" panel that shows the '
                'same names without you having to listen to anything.')
PDFTOOL = ('This test reads what is inside a downloaded PDF. Open the file in any PDF viewer and '
           'use the viewer\'s own text search (Ctrl+F) to find the text named below — that is '
           'enough. There is nothing to install.')
QUICKBOOKS = ('This test cannot be run without a company whose QuickBooks account is connected, '
              'because it checks what was sent to QuickBooks. If no QuickBooks-connected company '
              'is available, mark this test Blocked and say so — do not guess the result.')
COLOURPICK = ('This test names exact colours or sizes. Use the browser\'s own developer tools: '
              'press F12, pick the element with the inspector, and read its colour or size from '
              'the "Styles" panel. There is nothing to install. If you cannot get a clear reading, '
              'mark this test Blocked rather than guessing.')

TOOL = {}
def _t(text, ids):
    for i in ids:
        TOOL[i] = text

_t(NETWORK, [30388, 30389, 30390, 30391, 30190, 30191, 30192, 30193, 30194, 43546,
             30316, 30317, 30318, 30319, 30320, 30321, 30449, 30450])
_t(NETWORK_DB, [30605, 30606, 30607, 30608, 30609, 30610,
                30528, 30529, 30530, 30531, 30532, 30533])
_t(SCREENREADER, [30601, 30602, 30307, 30308, 38859, 30418, 30407, 30524, 30409, 30421])
_t(OFFLINE, [30289, 30182, 30164, 30300, 30301, 30518, 30184])
_t(PDFTOOL, [30283])
_t(QUICKBOOKS, [38925])
_t(COLOURPICK, [30169, 30186, 30304])
# C30121 / C30133 / C30185 / C30305 deliberately absent: pass 1 REPAIRED them so no
# tool is needed any more (the C30386 by-eye pattern).  Adding a tool line would
# contradict the repair.


def split_expected(e):
    """-> (items_text, ticket_line_or_None, provenance_block_or_None)"""
    lines = e.split('\n')
    prov = None
    for i in range(len(lines) - 1):
        if lines[i].strip() == SEP and lines[i + 1].lstrip().startswith(LEAD):
            prov = '\n'.join(lines[i:])
            lines = lines[:i]
            break
    tk = None
    while lines and lines[-1].startswith(KNOWN):
        tk = lines.pop()
    return '\n'.join(lines).rstrip(), tk, prov


def main():
    live = {c['id']: c for c in json.load(open(os.path.join(HERE, 'data', 'live-mid.json')))}
    ticket_of = {}
    for k, ids in OPEN_TICKETS.items():
        for i in ids:
            ticket_of[i] = k

    plan, stats = [], collections.Counter()
    for cid in sorted(set(ticket_of) | set(TOOL)):
        c = live.get(cid)
        if c is None:
            raise SystemExit(f'FATAL C{cid} not found live')
        if c['created_by'] != 3:
            raise SystemExit(f'FATAL Rule 38: C{cid} is not ours')
        intended, snapshot = {}, {}
        for f in ('title', 'refs', 'custom_preconds', 'custom_steps', 'custom_expected',
                  'custom_atmstatus', 'custom_automation_type', 'section_id', 'type_id',
                  'template_id', 'priority_id', 'estimate', 'milestone_id'):
            snapshot[f] = c.get(f)

        # ---- T ----
        if cid in ticket_of:
            e = c.get('custom_expected') or ''
            items, _old, prov = split_expected(e)
            if prov is None:
                raise SystemExit(f'FATAL C{cid}: no provenance line — pass 1 has not reached it')
            new = items + '\n' + KNOWN + JIRA + ticket_of[cid] + '\n' + prov
            if new != e:
                intended['custom_expected'] = new
                stats['T_ticket_line'] += 1

        # ---- P ----
        if cid in TOOL:
            p = c.get('custom_preconds') or ''
            text = TOOL[cid]
            ALL_TOOL_TEXTS = {NETWORK, NETWORK_DB, SCREENREADER, OFFLINE,
                              PDFTOOL, QUICKBOOKS, COLOURPICK}
            # a line that says ONLY "some tool is available" and nothing else — the vague
            # form this change exists to replace. Compound lines carrying a real
            # precondition are LEFT ALONE (dropping them would lose a precondition).
            VAGUE = re.compile(
                r'^\s*\d+\.\s*(A|An|The)\b[^.]*\b(screen reader|accessibility inspector|'
                r'network activity panel|developer tools|devtools|colour picker|color picker)'
                r'\b[^.]*\bis available\.?\s*$', re.I)
            out = []
            for l in p.split('\n'):
                if not l.strip():
                    continue
                stripped = re.sub(r'^\s*\d+\.\s*', '', l).strip()
                if stripped in ALL_TOOL_TEXTS:      # idempotency: our own earlier line
                    stats['P_replaced_own_line'] += 1
                    continue
                if VAGUE.match(l):                  # supersede the vague form
                    stats['P_superseded_vague_line'] += 1
                    continue
                out.append(stripped)
            out.append(text)
            newp = '\n'.join(f'{i}. {t}' for i, t in enumerate(out, 1))
            if newp != p:
                intended['custom_preconds'] = newp
                stats['P_tool_line'] += 1

        if not intended:
            stats['no_op'] += 1
            continue
        plan.append({'case_id': cid, 'internal_report': '-', 'title_snapshot': c['title'],
                     'held': False,
                     'layers': sorted((['T'] if 'custom_expected' in intended else [])
                                      + (['P'] if 'custom_preconds' in intended else [])),
                     'intended': intended, 'snapshot': snapshot})
        stats['writes'] += 1

    json.dump(plan, open(os.path.join(HERE, 'plan2.json'), 'w'), indent=1)
    print('=== PASS 2 PLAN ===')
    for k, v in sorted(stats.items()):
        print('  %-18s %d' % (k, v))
    print('  cases with BOTH T and P:',
          sum(1 for p in plan if p['layers'] == ['P', 'T']))
    tt = collections.Counter()
    for cid in TOOL:
        tt[{NETWORK: 'network panel', NETWORK_DB: 'network panel + developer read-back',
            SCREENREADER: 'screen reader (NVDA / VoiceOver)', OFFLINE: 'offline / throttling',
            PDFTOOL: 'PDF viewer text search', QUICKBOOKS: 'QuickBooks-connected company',
            COLOURPICK: 'element inspector (colour/size)'}[TOOL[cid]]] += 1
    print('  tool lines by type:')
    for k, v in tt.most_common():
        print('    %-38s %d' % (k, v))
    print('  ticket links by ticket:',
          {k: len(v) for k, v in OPEN_TICKETS.items()})
    print('  plan2 written')


if __name__ == '__main__':
    main()
