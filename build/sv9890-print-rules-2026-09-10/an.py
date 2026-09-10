import re,pathlib,sys
def style(env):
    h=pathlib.Path(f'inv4219-{env}.html').read_text()
    css=re.search(r'<style[^>]*>(.*?)</style>',h,re.S).group(1)
    # blank out comments in place so every byte offset stays valid
    return re.sub(r'/\*.*?\*/', lambda m:' '*len(m.group(0)), css, flags=re.S)
def print_ranges(css):
    rs=[]
    for m in re.finditer(r'@media\s+print\s*\{',css):
        i=m.end(); depth=1
        while depth and i<len(css):
            if css[i]=='{': depth+=1
            elif css[i]=='}': depth-=1
            i+=1
        rs.append((m.start(),i))
    return rs
def rules(css):
    """yield (pos, selector_list, body) for every declaration block that is not an at-rule header"""
    out=[]
    for m in re.finditer(r'([^{}@][^{}]*)\{([^{}]*)\}',css):
        sels=[s.strip() for s in m.group(1).split(',') if s.strip()]
        out.append((m.start(),sels,' '.join(m.group(2).split())))
    return out
SEL=sys.argv[2:] or ['.mh','.job','.job-first','.ps-body','.job-foot .ltot.with-divider','.b-break-line','.row-strong','.sign-line','.bal','.bal .v','.bal .k','.sum']
env=sys.argv[1]
css=style(env); prs=print_ranges(css)
print(f'== {env}: {len(prs)} print blocks at {[(a,b) for a,b in prs]}')
for pos,sels,body in rules(css):
    for s in SEL:
        if s in sels:
            blk=next((i+1 for i,(a,b) in enumerate(prs) if a<pos<b),0)
            where=f'print#{blk}' if blk else 'SCREEN'
            print(f'  {s:30s} {where:8s} {body[:120]}')
