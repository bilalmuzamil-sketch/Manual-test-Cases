import sys,json,re,html,time
sys.path.insert(0,'/tmp')
from trc import get, post
BUILD="v3.8-d0e135e"; DATE="8/19/2026"
DEFERRED_RE=re.compile(r'AUTOMATION:\s*Not available on Build to test Yet[^<\n]*')

def extract_plain(s):
    """Normalize any stored markdown/HTML form -> canonical plain text with \n separators."""
    if s is None: return ''
    t=s
    # ordered lists -> numbered lines
    def ol_repl(m):
        items=re.findall(r'<li>(.*?)</li>', m.group(1), re.S)
        return '\n'.join(f"{i+1}. {re.sub(r'<[^>]+>','',it).strip()}" for i,it in enumerate(items))
    t=re.sub(r'<ol>(.*?)</ol>', ol_repl, t, flags=re.S)
    t=re.sub(r'<hr\s*/?>', '\n\n---\n', t)
    t=re.sub(r'</p>\s*<p>', '\n\n', t)
    t=t.replace('<p>','').replace('</p>','')
    t=re.sub(r'<br\s*/?>', '\n', t)
    t=re.sub(r'<[^>]+>','', t)      # strip any residual tags
    t=html.unescape(t)
    # collapse 3+ newlines to 2
    t=re.sub(r'\n{3,}','\n\n',t)
    return t.strip('\n')

def to_br(plain):
    return plain.rstrip('\n').replace('\n\n','<br><br>').replace('\n','<br>')

def words(x):
    return re.sub(r'\s+',' ', html.unescape(re.sub(r'<[^>]+>',' ', x or ''))).strip()

def lift_marker_and_stamp(expected_plain):
    """Deferred->READY marker lift + add Rule-54 sentence 2 to the provenance line."""
    p=expected_plain
    # add build sentence-2 to provenance line (the one starting 'This is the expected behaviour')
    lines=p.split('\n')
    for i,ln in enumerate(lines):
        if ln.startswith('This is the expected behaviour') and 'Last checked against build' not in ln:
            lines[i]=ln.rstrip()
            if not lines[i].endswith('.'): lines[i]+='.'
            lines[i]+=f' Last checked against build {BUILD} on {DATE}.'
            break
    p='\n'.join(lines)
    # marker: deferred -> READY
    p=DEFERRED_RE.sub('AUTOMATION: READY', p)
    return p

def write_case(cid, preconds_plain, steps_plain, expected_plain, refs, title, oplog):
    payload={
        'custom_preconds': to_br(preconds_plain),
        'custom_steps': to_br(steps_plain),
        'custom_expected': to_br(expected_plain),
        'refs': refs, 'title': title,
    }
    r=post(f"update_case/{cid}", payload)
    time.sleep(0.3)
    d=get(f"get_case/{cid}")
    # verify
    checks={}
    for f,intended in [('custom_preconds',preconds_plain),('custom_steps',steps_plain),('custom_expected',expected_plain)]:
        stored=d.get(f) or ''
        checks[f]={
            'words_match': words(stored)==words(intended),
            'no_ol_li': ('<ol>' not in stored and '<li>' not in stored),
        }
    exp=d.get('custom_expected') or ''
    mk=re.findall(r'AUTOMATION:[^<\n]*', exp)
    prov=exp.count('This is the expected behaviour')
    checks['marker_count']=len(mk); checks['marker']=mk[-1].strip() if mk else None
    checks['prov_count']=prov
    checks['refs_match']=(d.get('refs')==refs)
    ok=all(c['words_match'] and c['no_ol_li'] for c in checks.values() if isinstance(c,dict)) and checks['marker_count']==1 and checks['prov_count']==1 and checks['refs_match']
    oplog.append({'cid':cid,'http':'200','ok':ok,'checks':checks})
    return ok, checks, d

BUILD_SENT_RE=re.compile(r'\s*Last checked against build [^.\n]* on [0-9/]+\.')
AUTO_LINE_RE=re.compile(r'AUTOMATION:.*$', re.M)

def refresh_build_sentence(plain):
    """Strip any existing 'Last checked against build ... on ....' and append a fresh one to prov line."""
    p=BUILD_SENT_RE.sub('', plain)
    lines=p.split('\n')
    for i,ln in enumerate(lines):
        if ln.startswith('This is the expected behaviour'):
            lines[i]=ln.rstrip()
            if not lines[i].endswith('.'): lines[i]+='.'
            lines[i]+=f' Last checked against build {BUILD} on {DATE}.'
            break
    return '\n'.join(lines)

def set_marker(plain, new_marker):
    return AUTO_LINE_RE.sub(new_marker, plain, count=1)

def build_verify(cid):
    """Fetch current, return (plain fields, current marker)."""
    d=get(f"get_case/{cid}")
    return {
        'title':d['title'],'refs':d['refs'],'atm':d.get('custom_atmstatus'),
        'preconds':extract_plain(d.get('custom_preconds')),
        'steps':extract_plain(d.get('custom_steps')),
        'expected':extract_plain(d.get('custom_expected')),
    }
