#!/usr/bin/env python3
"""Prove, ticket by ticket, that no attachment was lost by the two reformat passes.

Baselines (both captured BEFORE any write, both committed):
  Report Suite      snapshots/working-set.json      -> attachments per ticket (id, filename, size)
  Filters/Schedule  snapshots/pre-edit/<KEY>.json   -> fields.attachment (full objects)

Live: a fresh full read of every ticket. Compared BY ATTACHMENT ID, not by count --
a count match can hide a swap (Standing Rule 50).

Also compares the inline media references: for every surviving image/video the media
UUID is resolved and looked for in the current description ADF, so each one is
labelled INLINE or DANGLING, and any media node in the body with no matching
attachment is reported as a BROKEN reference.
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, HERE)
import jira as J

RS = os.path.join(ROOT, 'report-suite')
FS = os.path.join(ROOT, 'filters-schedule')
OUT = os.path.join(HERE, '..', 'snapshots')


def baseline():
    """ticket -> {half, written, baseline_attachments}"""
    b = {}
    ws = json.load(open(os.path.join(RS, 'snapshots', 'working-set.json')))
    for k, v in ws['working_set'].items():
        b[k] = {'half': 'Report Suite',
                'base': {str(a['id']): {'filename': a['filename'], 'size': a.get('size')}
                         for a in (v.get('attachments') or [])}}
    pop = json.load(open(os.path.join(FS, 'snapshots', 'population.json')))
    proj = pop['project']
    for k in pop['population']:
        p = os.path.join(FS, 'snapshots', 'pre-edit', f'{k}.json')
        d = json.load(open(p))
        fl = d.get('fields', d)
        b[k] = {'half': proj[k],
                'base': {str(a['id']): {'filename': a['filename'], 'size': a.get('size'),
                                        'mime': a.get('mimeType')}
                         for a in (fl.get('attachment') or [])}}
    return b


def pre_edit_adf(key, half):
    """The description ADF as it stood before any write, for the inline-before column."""
    if half == 'Report Suite':
        p = os.path.join(RS, 'snapshots', 'pre-edit', f'{key}.adf.json')
        return json.load(open(p)) if os.path.exists(p) else None
    p = os.path.join(FS, 'snapshots', 'pre-edit', f'{key}.json')
    if not os.path.exists(p):
        return None
    d = json.load(open(p))
    return (d.get('fields', d) or {}).get('description')


def main():
    b = baseline()
    written_rs = {json.loads(l)['ticket'] for l in
                  open(os.path.join(RS, 'execution-log.jsonl')) if l.strip()}
    written_fs = set()
    for f in os.listdir(os.path.join(FS, 'snapshots', 'post-edit')):
        if f.endswith('.json') and not f.endswith('.payload.json'):
            written_fs.add(f[:-5])
    written = written_rs | written_fs

    mid_cache_p = os.path.join(OUT, 'media-ids.json')
    mid = json.load(open(mid_cache_p)) if os.path.exists(mid_cache_p) else {}

    rows = []
    for key in sorted(b, key=lambda k: int(k.split('-')[1])):
        code, live = J.issue(key, out=os.path.join(OUT, 'live', f'{key}.json'))
        if code != '200':
            rows.append({'ticket': key, 'error': f'HTTP {code}'})
            continue
        fl = live['fields']
        live_att = {str(a['id']): {'filename': a['filename'], 'size': a.get('size'),
                                  'mime': a.get('mimeType')} for a in (fl.get('attachment') or [])}
        base_att = b[key]['base']
        missing = sorted(set(base_att) - set(live_att), key=int)
        added = sorted(set(live_att) - set(base_att), key=int)
        # filename check on the survivors: a swap keeps the count and changes the name
        renamed = [i for i in sorted(set(base_att) & set(live_att), key=int)
                   if base_att[i]['filename'] != live_att[i]['filename']]

        now_nodes = J.media_nodes(fl.get('description'))
        now_ids = {m for m, _ in now_nodes if m}
        before_nodes = J.media_nodes(pre_edit_adf(key, b[key]['half']))
        before_ids = {m for m, _ in before_nodes if m}

        media = []
        for aid, meta in sorted(live_att.items(), key=lambda kv: int(kv[0])):
            mime = meta.get('mime') or ''
            fn = meta['filename'].lower()
            is_visual = mime.startswith(('image/', 'video/')) or fn.endswith(
                ('.png', '.jpg', '.jpeg', '.gif', '.webm', '.mp4', '.mov'))
            if not is_visual:
                media.append({'id': aid, 'filename': meta['filename'], 'visual': False})
                continue
            if aid not in mid or not mid[aid]:
                mid[aid] = J.media_id(aid)
            u = mid.get(aid)
            media.append({'id': aid, 'filename': meta['filename'], 'visual': True,
                          'media_id': u,
                          'inline_now': bool(u and u in now_ids),
                          'inline_before': bool(u and u in before_ids)})
        broken = sorted(m for m in now_ids if m not in {x.get('media_id') for x in media})

        rows.append({
            'ticket': key, 'half': b[key]['half'],
            'rewritten': key in written,
            'status': fl['status']['name'],
            'resolution': (fl.get('resolution') or {}).get('name'),
            'attachments_before': len(base_att), 'attachments_now': len(live_att),
            'missing': [{'id': i, **base_att[i]} for i in missing],
            'added': [{'id': i, **live_att[i]} for i in added],
            'renamed': renamed,
            'media': media,
            'media_nodes_before': len(before_nodes), 'media_nodes_now': len(now_nodes),
            'broken_media_refs': broken,
            'verdict': 'LOSS' if missing else ('RENAMED' if renamed else
                       ('BROKEN-REF' if broken else 'OK')),
        })
        print(f"{key:9} {b[key]['half']:13} before={len(base_att):2} now={len(live_att):2} "
              f"missing={[m['id'] for m in rows[-1]['missing']]} "
              f"nodes {len(before_nodes)}->{len(now_nodes)} {rows[-1]['verdict']}")

    json.dump(mid, open(mid_cache_p, 'w'), indent=1)
    json.dump({'tickets': len(rows),
               'rewritten': sum(1 for r in rows if r.get('rewritten')),
               'loss': [r['ticket'] for r in rows if r.get('verdict') == 'LOSS'],
               'rows': rows}, open(os.path.join(OUT, 'attachment-audit.json'), 'w'), indent=1)
    losses = [r for r in rows if r.get('verdict') == 'LOSS']
    print(f"\n{len(rows)} tickets audited, {sum(1 for r in rows if r.get('rewritten'))} rewritten")
    print(f"LOSSES: {[r['ticket'] for r in losses] or 'none'}")


if __name__ == '__main__':
    os.makedirs(os.path.join(OUT, 'live'), exist_ok=True)
    main()
