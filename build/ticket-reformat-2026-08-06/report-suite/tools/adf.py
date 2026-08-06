"""ADF helpers: flatten an ADF document to readable text, and build the five-part body."""


def text_of(node):
    t = node.get('type')
    if t == 'text':
        return node.get('text', '')
    if t == 'hardBreak':
        return '\n'
    if t == 'inlineCard':
        return node.get('attrs', {}).get('url', '')
    if t == 'mediaSingle' or t == 'mediaGroup':
        ids = [c.get('attrs', {}).get('id', '?') for c in node.get('content', [])]
        return f'[IMAGE {" ".join(ids)}]'
    if t == 'media':
        return f'[IMAGE {node.get("attrs", {}).get("id", "?")}]'
    return ''.join(text_of(c) for c in node.get('content', []) or [])


def flatten(doc, _depth=0):
    """ADF document -> plain text, preserving block structure enough to read."""
    if not doc:
        return ''
    out = []
    for b in doc.get('content', []) or []:
        t = b.get('type')
        if t == 'heading':
            out.append('#' * b.get('attrs', {}).get('level', 1) + ' ' + text_of(b))
        elif t == 'paragraph':
            out.append(text_of(b))
        elif t == 'rule':
            out.append('---')
        elif t in ('bulletList', 'orderedList'):
            n = 1
            for li in b.get('content', []) or []:
                inner = flatten(li, _depth + 1).strip()
                bullet = f'{n}. ' if t == 'orderedList' else '- '
                lines = inner.split('\n')
                out.append('  ' * _depth + bullet + lines[0])
                for extra in lines[1:]:
                    out.append('  ' * (_depth + 1) + extra)
                n += 1
        elif t == 'listItem':
            out.append(flatten(b, _depth))
        elif t in ('panel', 'blockquote', 'expand'):
            out.append(flatten(b, _depth))
        elif t == 'codeBlock':
            out.append('```\n' + text_of(b) + '\n```')
        elif t == 'table':
            for row in b.get('content', []) or []:
                cells = [text_of(c).strip().replace('\n', ' ') for c in row.get('content', []) or []]
                out.append(' | '.join(cells))
        elif t in ('mediaSingle', 'mediaGroup'):
            out.append(text_of(b))
        else:
            out.append(text_of(b))
    return '\n'.join(x for x in out)


# ---------- builders ----------

def p(*parts):
    """paragraph from a list of (text) or ('link', text, url) or ('strong', text)"""
    content = []
    for x in parts:
        if isinstance(x, str):
            for i, seg in enumerate(x.split('\n')):
                if i:
                    content.append({'type': 'hardBreak'})
                if seg:
                    content.append({'type': 'text', 'text': seg})
        elif x[0] == 'link':
            content.append({'type': 'text', 'text': x[1],
                            'marks': [{'type': 'link', 'attrs': {'href': x[2]}}]})
        elif x[0] == 'strong':
            content.append({'type': 'text', 'text': x[1], 'marks': [{'type': 'strong'}]})
    return {'type': 'paragraph', 'content': content}


def h(level, txt):
    return {'type': 'heading', 'attrs': {'level': level},
            'content': [{'type': 'text', 'text': txt}]}


def ol(items):
    """items: list of str or list-of-parts"""
    lis = []
    for it in items:
        para = p(*it) if isinstance(it, (list, tuple)) else p(it)
        lis.append({'type': 'listItem', 'content': [para]})
    return {'type': 'orderedList', 'attrs': {'order': 1}, 'content': lis}


def media_para(mid, filename):
    """A mediaSingle referencing an image ALREADY attached to the issue, mirroring the
    exact attrs shape Jira itself writes for a pasted image."""
    return {'type': 'mediaSingle', 'attrs': {'layout': 'align-start'},
            'content': [{'type': 'media',
                         'attrs': {'type': 'file', 'id': mid,
                                   'alt': filename, 'collection': ''}}]}


def doc(nodes):
    return {'type': 'doc', 'version': 1, 'content': [n for n in nodes if n]}
