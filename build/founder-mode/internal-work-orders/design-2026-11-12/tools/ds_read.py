"""Read the design-system bundle by script (Rule 88): split it into its source files, list sizes, extract every comment
(the library's own documentation, incl. every always/never/must/should sentence) and every human-readable string literal.
python3 -I tools/ds_read.py -> render/ds-bundle-read.json + render/ds-comments.txt"""
import os, re, json, glob
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
B = glob.glob(os.path.join(ROOT, 'files/project/_ds/*/_ds_bundle.js'))[0]
s = open(B, encoding='utf-8').read()
marks = [(m.start(), m.group(1)) for m in re.finditer(r'^// ([\w./-]+\.(?:jsx?|js))\n', s, re.M)]
files = []
for i, (pos, name) in enumerate(marks):
    end = marks[i + 1][0] if i + 1 < len(marks) else len(s)
    files.append((name, s[pos:end]))
out = {'bundle': os.path.relpath(B, ROOT), 'bytes': len(s.encode()), 'lines': s.count('\n') + 1, 'files': []}
com_txt = []
rule_sents = []
for name, body in files:
    comments = re.findall(r'/\*[\s\S]*?\*/|(?<![:"\'\w])//[^\n]*', body)
    strings = re.findall(r"'((?:[^'\\\n]|\\.){3,})'|\"((?:[^\"\\\n]|\\.){3,})\"|`([^`]{3,})`", body)
    strs = sorted({(a or b or c).strip() for a, b, c in strings if re.search(r'[A-Za-z]{3,} [A-Za-z]', (a or b or c))})
    comps = sorted(set(re.findall(r'(?:function|const|class)\s+([A-Z][A-Za-z0-9]+)', body)))
    for c in comments:
        for sent in re.split(r'(?<=[.!?])\s+', re.sub(r'\s*\n\s*(\*|//)?\s*', ' ', c)):
            if re.search(r'\b(always|never|must|should|do not|don\'t)\b', sent, re.I): rule_sents.append({'file': name, 'sentence': sent.strip(' /*')[:400]})
    out['files'].append({'file': name, 'bytes': len(body.encode()), 'lines': body.count('\n'), 'comments': len(comments), 'string_literals_with_words': len(strs), 'components': comps})
    com_txt.append('##### ' + name + '\n' + '\n'.join(c.strip() for c in comments) + '\n----- strings:\n' + '\n'.join(strs))
out['rule_sentences'] = rule_sents
json.dump(out, open(os.path.join(ROOT, 'render', 'ds-bundle-read.json'), 'w'), indent=1)
open(os.path.join(ROOT, 'render', 'ds-comments.txt'), 'w').write('\n\n'.join(com_txt))
print(len(files), 'files'); [print(f['file'], f['bytes'], f['comments'], f['string_literals_with_words'], ','.join(f['components'])[:150]) for f in out['files']]
print('rule sentences', len(rule_sents))
