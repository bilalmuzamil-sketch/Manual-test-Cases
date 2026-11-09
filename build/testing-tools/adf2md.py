#!/usr/bin/env python3
"""Convert a saved Confluence getConfluencePage (ADF) JSON result to Markdown, text unaltered. Usage: python3 adf2md.py <saved.json> > out.md"""
import json,sys
def txt(n):
    t=n.get('type')
    if t=='text':
        s=n.get('text','')
        for m in n.get('marks',[]) or []:
            if m['type']=='strong': s=f"**{s}**"
            elif m['type']=='code': s=f"`{s}`"
            elif m['type']=='em': s=f"*{s}*"
            elif m['type']=='link': s=f"[{s}]({m['attrs'].get('href')})"
        return s
    if t=='hardBreak': return '\n'
    if t=='mention': return n['attrs'].get('text','@')
    if t=='emoji': return n['attrs'].get('text') or n['attrs'].get('shortName','')
    if t=='inlineCard': return n['attrs'].get('url','')
    if t=='status': return f"[{n['attrs'].get('text')}]"
    if t=='date': return n['attrs'].get('timestamp','')
    return ''.join(txt(c) for c in n.get('content',[]) or [])
def blk(n,ind=''):
    t=n.get('type'); c=n.get('content',[]) or []
    if t=='heading': return '#'*n['attrs']['level']+' '+txt(n)+'\n\n'
    if t=='paragraph': return ind+txt(n)+'\n\n'
    if t in('bulletList','orderedList'):
        out=''
        for i,li in enumerate(c,1):
            mark='- ' if t=='bulletList' else f'{i}. '
            inner=''.join(blk(x,ind+'  ') for x in li.get('content',[]))
            out+=ind+mark+inner.lstrip()
        return out+'\n'
    if t=='table':
        rows=[]
        for r in c:
            cells=[' '.join(blk(x).strip().replace('\n',' <br> ') for x in cell.get('content',[])).replace('|','\\|') for cell in r.get('content',[])]
            rows.append('| '+' | '.join(cells)+' |')
        if rows: rows.insert(1,'|'+'---|'*(rows[0].count(' | ')+1))
        return '\n'.join(rows)+'\n\n'
    if t=='codeBlock': return '```\n'+txt(n)+'\n```\n\n'
    if t=='rule': return '---\n\n'
    if t in('panel','blockquote','expand','nestedExpand','layoutSection','layoutColumn','bodiedExtension'):
        head=f"**{n['attrs'].get('title')}**\n\n" if t in('expand','nestedExpand') and n.get('attrs',{}).get('title') else ''
        return head+''.join(blk(x,ind) for x in c)
    if t in('extension','inlineExtension'): return f"[extension {n['attrs'].get('extensionKey')}]\n\n"
    if t in('mediaSingle','mediaGroup'): return '[image]\n\n'
    return ''.join(blk(x,ind) for x in c) if c else txt(n)
d=json.load(open(sys.argv[1]))['content']['nodes'][0]
print(f"# {d['title']}\n\nConfluence page {d['id']} | owner {d['author']['displayName']} | {d.get('webUrl','')}\n")
print(''.join(blk(x) for x in d['body']['content']))
