# Google Docs restarts numbering (and can garble headings) when a list sits inside a list item.
# Flatten every list in the part of a doc before Part 2 into plain paragraphs: numbered steps "1." "2." and bullets "•",
# sub-items indented with "–". Text is unchanged.
import re, sys, json
TOK = re.compile(r'(<ol>|<ul>|</ol>|</ul>|<li>|</li>)')
def flatten(h):
    out, stack, buf = [], [], []
    def flush():
        t = ''.join(buf).strip(); buf.clear()
        if not t or not stack: return t
        kind, n = stack[-1]
        depth = len(stack)
        mark = f'{n}.' if kind == 'ol' else ('•' if depth == 1 else '–')
        pad = '&nbsp;' * 6 * (depth - 1)
        out.append(f'<p>{pad}{mark} {t}</p>')
        return ''
    for part in TOK.split(h):
        if part in ('<ol>', '<ul>'):
            if stack: flush()
            stack.append([part[1:3], 0])
        elif part == '<li>':
            stack[-1][1] += 1
        elif part == '</li>':
            flush()
        elif part in ('</ol>', '</ul>'):
            flush(); stack.pop()
        else:
            m = re.search(r'<h[1-6]>', part) if stack else None
            if m:  # a heading inside an unclosed list: close the list first
                buf.append(part[:m.start()]); flush(); stack.clear(); out.append(part[m.start():])
            elif stack: buf.append(part)
            else: out.append(part)
    return ''.join(out)
if __name__ == '__main__':
    for path in sys.argv[1:]:
        h = open(path).read()
        head, tail = h.split('<h1>Part 2.', 1)
        open(path, 'w').write(flatten(head) + '<h1>Part 2.' + tail)
