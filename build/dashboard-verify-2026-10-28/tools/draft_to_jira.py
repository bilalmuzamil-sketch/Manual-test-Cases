#!/usr/bin/env python3
"""Turn a ticket draft (.md, Phase-1/Phase-2 layout) into Jira HTML + its filing fields.

Usage: python3 draft_to_jira.py DRAFT.md [OUT.json]
Out: {summary, parent, links[], pictures[], html}. In the HTML each screenshot caption "**n.** …" is followed by
the placeholder {{IMG<n>}}; the filer replaces it with the uploaded picture's media node. The header comment and any
"For developers" section are dropped (QA lead, 29 Oct 2026: no technical or developer section in tickets).
"""
import html, json, re, sys


def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r'`([^`]+)`', r'\1', t)                                   # no code styling in plain tickets
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<em>\1</em>', t)
    t = re.sub(r'\((https?://[^)\s]+)\)', r'(<a href="\1">\1</a>)', t)
    return t


def convert(md):
    hdr = re.match(r'\s*<!--(.*?)-->', md, re.S)
    head = hdr.group(1) if hdr else ''
    body = md[hdr.end():] if hdr else md
    body = re.sub(r'\n## For developers\n.*?(?=\n## |\Z)', '\n', body, flags=re.S)
    field = lambda k: (re.search(rf'^{k}[^:\n]*:\s*(.*)$', head, re.M) or [None, ''])[1].strip()
    out, lines, i = [], body.split('\n'), 0
    in_shots = False
    while i < len(lines):
        l = lines[i]
        if not l.strip():
            i += 1; continue
        if l.startswith('## '):
            in_shots = l[3:].strip().lower().startswith('screenshot')
            out.append(f'<h2>{inline(l[3:].strip())}</h2>'); i += 1; continue
        if l.strip() == '---':
            out.append('<hr>'); i += 1; continue
        if l.startswith('>'):
            q = []
            while i < len(lines) and lines[i].startswith('>'):
                q.append(lines[i][1:].strip()); i += 1
            out.append('<blockquote><p>' + inline(' '.join(q)) + '</p></blockquote>'); continue
        if l.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                cells = [c.strip() for c in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r':?-{2,}:?', c) for c in cells): rows.append(cells)
                i += 1
            t = '<table><thead><tr>' + ''.join(f'<th><p>{inline(c)}</p></th>' for c in rows[0]) + '</tr></thead><tbody>'
            t += ''.join('<tr>' + ''.join(f'<td><p>{inline(c)}</p></td>' for c in r) + '</tr>' for r in rows[1:])
            out.append(t + '</tbody></table>'); continue
        if re.match(r'\d+\.\s', l):
            items = []
            start = int(re.match(r'(\d+)\.', l).group(1))
            while i < len(lines) and (re.match(r'\d+\.\s', lines[i]) or re.match(r'\s{2,}[-*]\s', lines[i]) or (lines[i].startswith('   ') and lines[i].strip())):
                ln = lines[i]
                if re.match(r'\d+\.\s', ln): items.append([re.sub(r'^\d+\.\s+', '', ln), []])
                elif re.match(r'\s{2,}[-*]\s', ln): items[-1][1].append(re.sub(r'^\s*[-*]\s+', '', ln))
                else: items[-1][0] += ' ' + ln.strip()
                i += 1
            h = f'<ol start="{start}">'
            for txt, subs in items:
                h += '<li><p>' + inline(txt) + '</p>' + (('<ul>' + ''.join(f'<li><p>{inline(s)}</p></li>' for s in subs) + '</ul>') if subs else '') + '</li>'
            out.append(h + '</ol>'); continue
        if re.match(r'[-*]\s', l):
            items = []
            while i < len(lines) and (re.match(r'[-*]\s', lines[i]) or re.match(r'\s{2,}\S', lines[i])):
                ln = lines[i]
                if re.match(r'[-*]\s', ln): items.append(re.sub(r'^[-*]\s+', '', ln))
                else: items[-1] += ' ' + ln.strip()
                i += 1
            out.append('<ul>' + ''.join(f'<li><p>{inline(x)}</p></li>' for x in items) + '</ul>'); continue
        para = [l.strip()]; i += 1
        while i < len(lines) and lines[i].strip() and not re.match(r'(## |\||>|\d+\.\s|[-*]\s|---)', lines[i]):
            para.append(lines[i].strip()); i += 1
        p = ' '.join(para)
        out.append(f'<p>{inline(p)}</p>')
        m = re.match(r'\*\*(\d+)\.\*\*', p)
        if in_shots and m: out.append('{{IMG' + m.group(1) + '}}')
    links = re.findall(r'SV-\d+', field('LINKS'))
    parent = re.search(r'PARENT (SV-\d+)', head)
    return {'summary': field('SUMMARY'), 'parent': parent.group(1) if parent else 'SV-11839',
            'links': [k for k in dict.fromkeys(links) if k != (parent.group(1) if parent else '')],
            'pictures': [p.strip() for p in field('PICTURES').split('·') if p.strip()], 'html': '\n'.join(out)}


if __name__ == '__main__':
    r = convert(open(sys.argv[1]).read())
    if len(sys.argv) > 2: json.dump(r, open(sys.argv[2], 'w'), indent=1)
    print(json.dumps({k: v for k, v in r.items() if k != 'html'}, indent=1)); print(len(r['html']), 'chars of html')
