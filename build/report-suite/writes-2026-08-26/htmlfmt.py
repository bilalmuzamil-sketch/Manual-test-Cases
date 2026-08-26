# -*- coding: utf-8 -*-
"""Single-top-level-block storage HTML — the ONLY shape this TestRail API round-trips
byte-identically (proven by probe: >=2 top-level blocks and the sanitiser relocates the
first closing tag to the end, nesting everything inside it)."""
from html.entities import codepoint2name

def ent(s):
    out=[]
    for ch in s:
        cp=ord(ch)
        if cp < 128: out.append(ch)
        elif cp in codepoint2name: out.append('&%s;'%codepoint2name[cp])
        else: out.append('&#%d;'%cp)
    return ''.join(out)

def block(lines):
    """lines: list of strings already entity-safe-able; '' means a blank display line."""
    return '<p>' + '<br>'.join(ent(l) if not l.startswith('\x00') else l[1:] for l in lines) + '</p>\n'

def numbered(items):
    return ['%d. %s'%(i+1,t) for i,t in enumerate(items)]

def expected(items, notes, prov, marker):
    lines = numbered(items)
    for n in notes:
        lines += ['', n]
    lines += ['']
    lines += prov
    lines += ['', marker]
    return block(lines)

def plain(items):
    return block(numbered(items))
