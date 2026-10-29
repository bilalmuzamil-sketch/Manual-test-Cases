"""Probe the shape of one /api/notes row (keys only + small values). TZ=Asia/Karachi python3 probe_notes.py"""
import json
from common import *
w = WID['hd']; assert os.environ.get('TZ') == TZ[w]; print('change-location', loc(w))
s, j = get('/api/notes', [('pagination[page]', 1), ('pagination[rowsPerPage]', 3)], w)
d = j.get('data') or {}; print(s, list(d.keys()), d.get('pagination'))
n = d.get('notes', [])[0]
print({k: (v if not isinstance(v, (dict, list, str)) or len(json.dumps(v)) < 80 else (list(v.keys()) if isinstance(v, dict) else type(v).__name__)) for k, v in n.items()})
