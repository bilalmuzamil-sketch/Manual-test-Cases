import sys, json
P = json.load(open(sys.argv[1])); src = '--src' in sys.argv
for k in [a for a in sys.argv[2:] if not a.startswith('--')]:
    v = P[k]; f = v['fields']
    import re, html
    def t(h): return html.unescape(re.sub(r'<[^>]+>', '|', h))
    print(f"=== {k} [{v['sec']}] {v['title']}\n refs: {v['refs']}\n pics: {v['pictures']} flags {v['flags']} held_on {v['held_on']}")
    pre = re.findall(r'<li>(.*?)</li>', f['custom_preconds']); print(' PRE:'); [print('  -', html.unescape(x)) for x in pre]
    st = re.findall(r'<li>(.*?)</li>', f['custom_steps']); print(' STEPS:'); [print(f'  {i}.', html.unescape(x)) for i, x in enumerate(st, 1)]
    ex = f['custom_expected']; parts = re.split(r'<p>Step (\d+):</p>', ex); bi = 0
    for i in range(1, len(parts), 2):
        print(f'  R{parts[i]}:')
        for b in re.findall(r'<li>(.*?)</li>', parts[i+1]):
            print('   *', html.unescape(b)); 
            if src: print('       <-', [(s[0], s[1], (s[2] or '')[:90], s[3]) for s in v['sources'][bi]])
            bi += 1
    print(' END:', html.unescape(re.sub(r'<[^>]+>', ' ', parts[-1].split('</ul>')[-1])).strip())
