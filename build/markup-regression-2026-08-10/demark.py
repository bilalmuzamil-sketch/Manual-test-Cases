"""Convert TestRail-rendered HTML back to the house plain-text form.
Formatting only: the text content must survive word-for-word."""
import re, html

def _unescape(s):
    return html.unescape(s).replace('\xa0', ' ')

def demark(s):
    if not s or not re.search(r'<[a-zA-Z/!]', s):
        return s
    t = s.replace('\r\n', '\n')
    # anchors -> their visible text
    t = re.sub(r'<a\b[^>]*>(.*?)</a>', lambda m: m.group(1), t, flags=re.S | re.I)
    # ordered lists -> 1. 2. 3.
    def ol(m):
        items = re.findall(r'<li\b[^>]*>(.*?)</li>', m.group(1), flags=re.S | re.I)
        out = []
        for i, x in enumerate(items, 1):
            out.append(str(i) + '. ' + re.sub(r'\s+', ' ', x).strip())
        return '\n'.join(out)
    t = re.sub(r'<ol\b[^>]*>(.*?)</ol>', ol, t, flags=re.S | re.I)
    # unordered lists -> the house bullet
    def ul(m):
        items = re.findall(r'<li\b[^>]*>(.*?)</li>', m.group(1), flags=re.S | re.I)
        return '\n'.join('· ' + re.sub(r'\s+', ' ', x).strip() for x in items)
    t = re.sub(r'<ul\b[^>]*>(.*?)</ul>', ul, t, flags=re.S | re.I)
    # line breaks and rules
    t = re.sub(r'<br\s*/?>', '\n', t, flags=re.I)
    t = re.sub(r'<hr\s*/?>', '---', t, flags=re.I)
    # paragraphs -> blank-line separated blocks
    t = re.sub(r'<p\b[^>]*>', '', t, flags=re.I)
    t = re.sub(r'</p>', '\n\n', t, flags=re.I)
    t = re.sub(r'</?(div|span|strong|em|b|i|u)\b[^>]*>', '', t, flags=re.I)
    leftover = re.findall(r'<[^>]+>', t)
    t = _unescape(t)
    # tidy whitespace without touching words
    t = re.sub(r'[ \t]+\n', '\n', t)
    t = re.sub(r'\n{3,}', '\n\n', t)
    # house separator form: exactly one blank line before ---, none after
    t = re.sub(r'\n*---\n*(?=This is the expected)', '\n\n---\n', t)
    t = t.strip('\n') + '\n'
    return t, leftover

def words(s):
    """Word sequence of a field, tags stripped and list numbering removed."""
    t = re.sub(r'<[^>]+>', ' ', s or '')
    t = _unescape(t)
    t = re.sub(r'(?m)^\s*(?:\d+\.|·|-)\s+', ' ', t)   # list markers, either form
    t = t.replace('---', ' ')
    return re.findall(r'[0-9A-Za-zÀ-ɏ]+', t.lower())
