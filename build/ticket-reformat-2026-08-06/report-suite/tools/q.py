#!/usr/bin/env python3
"""Grep an anchor or phrase out of a live-fetched spec. q.py <slug> <pattern> [ctx]"""
import sys, os, re, glob
HERE=os.path.dirname(os.path.abspath(__file__))
slug, pat = sys.argv[1], sys.argv[2]
ctx = int(sys.argv[3]) if len(sys.argv)>3 else 0
f = glob.glob(os.path.join(HERE,'..','specs',f'{slug}-v*.txt'))[0]
lines = open(f).read().split('\n')
for i,l in enumerate(lines):
    if re.search(pat, l, re.I):
        for j in range(max(0,i-ctx), min(len(lines), i+ctx+1)):
            print(f'{j:5d}| {lines[j]}')
        if ctx: print('-'*40)
