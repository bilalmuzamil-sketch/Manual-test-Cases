#!/usr/bin/env python3
"""Schedule recovery — the case edits the interrupted worker's own findings require.

Ten cases, `update_case` on `custom_expected` ONLY.  Two classes of fix:

  (a) EIGHT cases said "It has been reported to the QA lead but has no developer
      ticket yet" when the ticket HAD in fact been filed hours earlier.  All ten
      tickets SV-8848..SV-8857 were verified live in Jira first (Bug / priority Low /
      parent SV-8685 / owning story linked / Open), and one case is corrected to name
      another QA's ticket SV-8827, which its own text already alluded to as "the
      ticket".
  (b) TWO cases leaked developer jargon into tester-facing text — the very thing the
      worker's own audit hunted and repaired on three other cases.

Verification per Standing Rule 50, per operation:
  1. re-GET and prove the case still byte-matches the pre-write snapshot (drift check)
  2. update_case with ONLY custom_expected
  3. re-GET and compare EVERY field: the intended field byte-equal to the intended
     value, every other field byte-identical to the pre-write snapshot
     (only updated_on / updated_by excepted as server-volatile)
  4. a mismatch means the write FAILED — stop the batch and dump both byte sequences

Rule 38: refuses any case whose created_by is not 3.
"""
import json, os, sys, copy

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'viu-2026-08-04', 'tools'))
import tr  # noqa: E402

J = 'https://shopview.atlassian.net/browse/'
OLD = ("It has been reported to the QA lead but has no developer ticket yet. Mark this test "
       "FAILED and note it in your run comment; do not raise a new ticket without asking the "
       "QA lead.")


def ticket(k):
    return ("This is already raised with the developers as %s (%s%s). Mark this test FAILED and "
            "put the ticket number in your run comment; do not raise a new ticket for it." % (k, J, k))


# case id -> list of (find, replace) applied in order; every find MUST be present
EDITS = {
    29946: [(OLD, ticket('SV-8857'))],
    29982: [(OLD, ticket('SV-8855'))],
    29999: [(OLD, ticket('SV-8850'))],
    30014: [(OLD, ticket('SV-8852'))],
    30050: [(OLD, ticket('SV-8851'))],
    30066: [(OLD, ticket('SV-8853'))],
    30068: [(OLD, ticket('SV-8853'))],
    # (a) + (b) together — one operation, whole case re-read first (Rule 41)
    30004: [
        ("moved the shift a full hour, 13:00Z to 14:00Z, via PATCH /api/schedule/shifts/{id}.",
         "moved the shift a full hour instead of the half hour you dragged it."),
        (" The pre-existing shift was restored afterwards.", ""),
        (OLD, ticket('SV-8856')),
    ],
    # names the other QA's ticket its own text already referred to as "the ticket"
    30046: [
        ("NOTE the ticket also claims Tech Hours defaults ON; on this build it does not. " + OLD,
         "The Business Hours half of this is already raised with the developers as SV-8827 "
         "(%sSV-8827); that same ticket also says Tech Hours starts ON, which it does not on "
         "this build. Mark this test FAILED and put the ticket number in your run comment; do "
         "not raise a new ticket for it." % J),
    ],
    # (b) only — deliberately still unticketed (decisions register entry 7 + API-ASK.md)
    38863: [
        ("produced 7 shifts with acknowledgeLongSeries:false and no prompt, and nothing on this "
         "build returns 409 or 422 for a long series.",
         "produced 7 shifts with no warning and nothing asking you to confirm, and nothing on "
         "this build refuses or questions a very long series."),
    ],
}

VOLATILE = {'updated_on', 'updated_by'}


def main():
    ids = sorted(EDITS)
    pre, intended = {}, {}
    for cid in ids:
        s, c = tr.api('get_case/%d' % cid)
        if s != 200:
            sys.exit('pre-read C%d -> %s %s' % (cid, s, c))
        if c.get('created_by') != 3:
            sys.exit('REFUSED C%d: created_by=%s is not ours (Rule 38)' % (cid, c.get('created_by')))
        pre[cid] = c
        exp = c['custom_expected']
        for find, rep in EDITS[cid]:
            if find not in exp:
                sys.exit('C%d: expected text not found, refusing to guess:\n  %r' % (cid, find[:110]))
            exp = exp.replace(find, rep, 1)
        if exp == c['custom_expected']:
            sys.exit('C%d: edit produced no change' % cid)
        intended[cid] = exp

    json.dump(pre, open(os.path.join(HERE, 'pre-write-cases.json'), 'w'), indent=1)
    log = []

    for n, cid in enumerate(ids, 1):
        # 1. drift check
        s, live = tr.api('get_case/%d' % cid)
        if s != 200:
            sys.exit('drift-read C%d -> %s' % (cid, s))
        drift = [k for k in set(live) | set(pre[cid])
                 if k not in VOLATILE and json.dumps(live.get(k), sort_keys=True)
                 != json.dumps(pre[cid].get(k), sort_keys=True)]
        if drift:
            sys.exit('C%d DRIFTED since the snapshot on %s — stopping' % (cid, drift))

        # 2. write
        s, res = tr.api('update_case/%d' % cid, {'custom_expected': intended[cid]})
        if s != 200:
            sys.exit('WRITE FAILED C%d -> %s %s' % (cid, s, res))

        # 3. re-GET and compare EVERY field
        s, after = tr.api('get_case/%d' % cid)
        if s != 200:
            sys.exit('post-read C%d -> %s' % (cid, s))
        keys = sorted(set(after) | set(pre[cid]))
        problems = []
        for k in keys:
            if k in VOLATILE:
                continue
            want = intended[cid] if k == 'custom_expected' else pre[cid].get(k)
            got = after.get(k)
            if json.dumps(got, sort_keys=True) != json.dumps(want, sort_keys=True):
                problems.append(k)
        if problems:
            print('MISMATCH on C%d, fields %s — THE WRITE FAILED' % (cid, problems))
            for k in problems:
                print('  field', k)
                print('   intended bytes:', repr(intended[cid] if k == 'custom_expected'
                                                 else pre[cid].get(k))[:900])
                print('   actual bytes  :', repr(after.get(k))[:900])
            sys.exit(1)

        rec = {'op': n, 'case_id': cid, 'http': s, 'fields_compared': len(keys) - len(VOLATILE),
               'verified': 'MATCH', 'problems': []}
        log.append(rec)
        print('op %2d | C%d | 200 | %d fields compared | MATCH' % (n, cid, rec['fields_compared']))

    with open(os.path.join(HERE, 'exec-log.jsonl'), 'w') as fh:
        for r in log:
            fh.write(json.dumps(r) + '\n')
    print('\n%d operations, %d HTTP 200, %d byte-verified MATCH, 0 mismatch'
          % (len(log), len(log), len(log)))


if __name__ == '__main__':
    main()
