#!/usr/bin/env python3
"""Small Markdown -> HTML converter for our ticket drafts (## headings, paragraphs, '1.' / '-' lists, '>' quotes, '---',
**bold**, *italic* / _italic_, `code`, bare URLs), plus positional picture embeds for Jira's HTML content format.
Usage: python3 md_to_jira_html.py draft.md out.html [--fig "<caption start>|<mediaId>|<collection>|<filename>"]...
SECRET-FREE."""
import html, re, sys

def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<em>\1</em>', t)
    t = re.sub(r'(?<![\w])_(?!\s)(.+?)(?<!\s)_(?![\w])', r'<em>\1</em>', t)
    t = re.sub(r'(?<!["=>])(https?://[^\s<)]+)', r'<a href="\1">\1</a>', t)
    return t

def convert(md):
    out, para, lst, quote = [], [], None, []
    def flush():
        nonlocal para, lst, quote
        if para: out.append('<p>' + inline(' '.join(para)) + '</p>'); para = []
        if lst: out.append(f'<{lst[0]}>' + ''.join(f'<li><p>{inline(x)}</p></li>' for x in lst[1]) + f'</{lst[0]}>'); lst = None
        if quote: out.append('<blockquote><p>' + inline(' '.join(quote)) + '</p></blockquote>'); quote = []
    for raw in md.split('\n'):
        line = raw.rstrip()
        if not line.strip(): flush(); continue
        m = re.match(r'^(#{1,6})\s+(.*)', line)
        if m: flush(); n = len(m.group(1)); out.append(f'<h{n}>{inline(m.group(2))}</h{n}>'); continue
        if re.match(r'^-{3,}$', line.strip()): flush(); out.append('<hr />'); continue
        if line.startswith('>'): (para and flush()); quote.append(line.lstrip('> ').strip()); continue
        m = re.match(r'^\s*(\d+)\.\s+(.*)', line) or re.match(r'^\s*[-*]\s+(.*)', line)
        if m:
            kind = 'ol' if re.match(r'^\s*\d+\.', line) else 'ul'
            if para or quote: flush()
            if lst and lst[0] != kind: flush()
            if not lst: lst = [kind, []]
            lst[1].append(m.group(m.lastindex)); continue
        if lst and raw.startswith(('   ', '\t')): lst[1][-1] += ' ' + line.strip(); continue
        if lst: flush()
        para.append(line.strip())
    flush()
    return ''.join(out)

def fig(mid, coll, name):
    return (f'<figure data-type="media-single" data-layout="center" data-width="100" data-width-type="percentage">'
            f'<div data-type="media" data-media-type="file" data-id="{mid}" data-collection="{coll}" data-alt="{name}"></div></figure>')

if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    h = convert(open(src).read())
    args = sys.argv[3:]
    for i in range(0, len(args), 2):
        assert args[i] == '--fig'
        cap, mid, coll, name = args[i + 1].split('|')
        start = h.index(inline(cap)); end = h.index('</p>', start) + 4
        h = h[:end] + fig(mid, coll, name) + h[end:]
    open(dst, 'w').write(h); print(len(h))
