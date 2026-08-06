#!/usr/bin/env python3
"""Render one authored ticket record into the five-part ADF body.

The shape, and nothing else in it:
  1  Description            (concise)
  2  Steps to reproduce     (one Environment line, then numbered steps)
  3  Current behaviour      (plain words; at most one short dev-locating line)
  4  Expected behaviour     (plain words)
     ---- rule = the line break the QA lead asked for ----
  5  Source                 (where the expected behaviour comes from)
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import adf

APP = 'https://sv8582.qa.shopview.com'
BRANCH = 'sv8582'
ENV_DEFAULT = ("Environment: QA branch {b} ({u}). Desktop browser, signed in as an Admin.")

SPEC_NAME = {
    'sbc': ('Sales By Customer', 15, 'https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/577634305/SBC+Sales+By+Customer+Report'),
    'sbr': ('Sales By Representative', 17, 'https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/585629698/SBR+Sales+By+Representative+Report'),
    'pv':  ('Parts Velocity', 5, 'https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/620888066/Parts+Velocity+Report'),
    'tu':  ('Technician Utilization', 6, 'https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/641400833/Technician+Utilization+Report'),
    'wip': ('Work In Progress', 9, 'https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/703660034/WIP+Work+In+Progress+Report'),
    'iv':  ('Inventory Value', 4, 'https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/720142338/Inventory+Value+Report'),
}


def env_line(rec):
    if rec.get('env'):
        return rec['env']
    return ENV_DEFAULT.format(b=BRANCH, u=APP)


def paras(txt):
    """blank-line separated text -> list of ADF paragraphs"""
    if not txt:
        return []
    return [adf.p(chunk.strip()) for chunk in txt.strip().split('\n\n') if chunk.strip()]


def source_paras(rec):
    """rec['source'] entries:
        ('spec', slug, anchor, quote)      a specification requirement
        ('spec_note', slug, label, quote)  a named spec passage that is not an S-anchor
        ('story', key, title, quote)       an epic story
        ('po', label, url, quote)          the PO's answer sheet
        ('note', text)                     one honest sentence of context
    The first paragraph is labelled "Source." Consecutive citations of the SAME
    specification are compacted to "The same description, requirement X" so the
    section stays short.
    """
    out, first, last_slug = [], True, None
    for e in rec['source']:
        kind = e[0]
        bits = [('strong', 'Source'), ' \u2014 '] if first else []
        if kind in ('spec', 'spec_note'):
            slug, anchor, quote = e[1], e[2], e[3]
            name, ver, url = SPEC_NAME[slug]
            label = f'requirement {anchor}' if kind == 'spec' else anchor
            if slug == last_slug and not first:
                bits.append(f'The same description, {label}: \u201c{quote}\u201d')
            else:
                bits.append('the ' if first else 'The ')
                bits.append(('link', f'{name} report specification', url))
                bits.append(f' on Confluence, version {ver}, {label}: \u201c{quote}\u201d')
            last_slug = slug
        elif kind == 'story':
            key, title, quote = e[1], e[2], e[3]
            bits.append('')
            bits.append(('link', f'story {key}', f'https://shopview.atlassian.net/browse/{key}'))
            bits.append(f' ({title}): \u201c{quote}\u201d' if quote else f' ({title}).')
            last_slug = None
        elif kind == 'po':
            label, url, quote = e[1], e[2], e[3]
            bits.append(('link', label, url))
            bits.append(f': \u201c{quote}\u201d' if quote else '.')
            last_slug = None
        elif kind == 'note':
            bits.append(e[1])
        out.append(adf.p(*[b for b in bits if b != '']))
        first = False
    return out


def build(rec):
    nodes = [adf.h(3, 'Description')]
    nodes += paras(rec['description'])

    nodes.append(adf.h(3, 'Steps to reproduce'))
    nodes.append(adf.p(env_line(rec)))
    nodes.append(adf.ol(rec['steps']))

    nodes.append(adf.h(3, 'Current behaviour'))
    nodes += paras(rec['current'])
    for img in rec.get('images', []):
        nodes.append(adf.media_para(img['media_id'], img['filename']))
        if img.get('caption'):
            nodes.append(adf.p(img['caption']))

    nodes.append(adf.h(3, 'Expected behaviour'))
    nodes += paras(rec['expected'])

    nodes.append({'type': 'rule'})
    nodes += source_paras(rec)
    return adf.doc(nodes)


if __name__ == '__main__':
    HERE = os.path.dirname(os.path.abspath(__file__))
    for k in sys.argv[1:]:
        rec = json.load(open(os.path.join(HERE, '..', 'authored', k + '.json')))
        print('=' * 90)
        print(adf.flatten(build(rec)))
