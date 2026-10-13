#!/usr/bin/env python3
"""Find what the QA lead (or anyone) answered or said earlier, word for word, with its time (12 Oct 2026).
Searches the Claude Code session transcripts on this machine (~/.claude/projects/*/*.jsonl): answered questions
("…"="answer") and the person's own messages. Transcripts live only as long as the container — anything that must
outlive it belongs in a RESULTS-*.json, RESUME-HERE.md or the learnings log (search those with recall.py).
Usage: python3 build/testing-tools/find_ruling.py "Defect 5" [--user-only] [--max 10]
Quote what it prints exactly; for the QA lead's OWN rulings a test carries one dated decision line, never the chat (Rule 114(d))."""
import argparse, glob, json, os
ap = argparse.ArgumentParser(); ap.add_argument('words'); ap.add_argument('--user-only', action='store_true'); ap.add_argument('--max', type=int, default=10)
a = ap.parse_args(); w = a.words.lower(); n = 0
for path in sorted(glob.glob(os.path.expanduser('~/.claude/projects/*/*.jsonl')), key=os.path.getmtime, reverse=True):
    for line in open(path, encoding='utf-8', errors='replace'):
        if w not in line.lower(): continue
        try: j = json.loads(line)
        except Exception: continue
        if j.get('type') != 'user': continue
        c = j.get('message', {}).get('content'); texts = []
        if isinstance(c, str): texts = [('said', c)]
        else:
            for x in c or []:
                if x.get('type') == 'text': texts.append(('said', x.get('text', '')))
                elif x.get('type') == 'tool_result' and not a.user_only:
                    s = x.get('content'); s = s if isinstance(s, str) else json.dumps(s)
                    if s.lstrip().startswith(('Your questions have been answered', 'The user answered')): texts.append(('answered', s))
        for kind, s in texts:
            if w in s.lower() and not s.startswith('This session is being continued'):
                print(f"{j.get('timestamp','?')} [{kind}] {s[:1500]}\n---"); n += 1
                if n >= a.max: raise SystemExit
if not n: print('nothing found — try other words, or recall.py for what was written into the repo')
