"""Split every board file into its fixed boilerplate and its own content; prove the boilerplate is identical across boards.
python3 -I tools/board_parts.py  -> render/board-parts.json"""
import os, re, json, hashlib, glob
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); P = os.path.join(ROOT, 'files', 'project')
out = {}
heads = {}
for f in sorted(glob.glob(os.path.join(P, '*.dc.html'))):
    s = open(f, encoding='utf-8').read(); n = os.path.basename(f)
    i = s.find('<x-dc>'); j = s.rfind('</x-dc>')
    head = re.sub(r'<title>.*?</title>', '<title>…</title>', s[:i]); tail = s[j:]
    heads.setdefault(hashlib.sha256((head + '|' + tail).encode()).hexdigest()[:12], []).append(n)
    title = re.search(r'<title>(.*?)</title>', s).group(1)
    out[n] = dict(bytes=len(s.encode()), lines=s.count('\n') + 1, sha256=hashlib.sha256(s.encode()).hexdigest(), title=title, body=s[i + 6:j])
json.dump(dict(boilerplate_groups={k: v for k, v in heads.items()}, boards=out), open(os.path.join(ROOT, 'render', 'board-parts.json'), 'w'), indent=1)
print({k: len(v) for k, v in heads.items()})
for k, v in heads.items():
    if len(v) < 10: print(k, v)
