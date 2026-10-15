#!/usr/bin/env python3
"""Parse a live TestRail case already in the Rule 117 layout (bold doc link, Preconditions list, Steps list, Expected =
results, Source, optional divergence, quotes, optional checked, marker) back into proposal parts, so a pass changes only
what it means to change. parse(case) returns (parts, rebuilt_ok): rebuilt_ok is True only when rebuilding the three
fields with the apply script's own HTML builders gives the live HTML byte for byte."""
import re, html
def _un(s): return html.unescape(re.sub(r"<[^>]+>", "", s))
def _lis(block): return [_un(x) for x in re.findall(r"<li>(.*?)</li>", block, re.S)]
def parse(c):
    pre, st, ex = c["custom_preconds"] or "", c["custom_steps"] or "", c["custom_expected"] or ""
    m = re.match(r'<p><strong><a href="([^"]+)">Setup \(manual QA tester and Claude session\)</a></strong></p><p></p><p><strong>Preconditions</strong></p><ul>(.*)</ul>$', pre, re.S)
    if not m: return None, False
    p = {"reuse_doc": m.group(1), "preconditions": _lis("<ul>" + m.group(2) + "</ul>")}
    p["steps"] = _lis(st)
    m2 = re.match(r"<p><strong>Expected results</strong></p><ul>(.*?)</ul><p><strong>Source &mdash; where this behaviour comes from</strong><br>(.*?)</p>(.*?)<p><strong>Exact quotes from the source \(for reproducibility\)</strong></p><ul>(.*?)</ul>(.*)<p>([^<]*)</p>$", ex, re.S)
    if not m2: return p, False
    p["results"] = _lis("<ul>" + m2.group(1) + "</ul>")
    p["source"] = _un(m2.group(2))
    div = re.findall(r"<p>(.*?)</p>", m2.group(3), re.S)
    if div: p["divergence"] = _un(div[0])
    p["quotes"] = [[_un(a), _un(q)] for a, q in re.findall(r"<li><strong>(.*?):</strong> &ldquo;(.*?)&rdquo;</li>", m2.group(4), re.S)]
    chk = re.findall(r"<p>(.*?)</p>", m2.group(5), re.S)
    if chk: p["checked"] = _un(chk[0])
    p["marker"] = _un(m2.group(6)); p["title"] = c["title"]
    return p, None
