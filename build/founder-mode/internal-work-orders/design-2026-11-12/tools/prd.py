"""PRD index for the Internal Work Orders design drive: the saved PRD (Final v1.0, 2026-11-09) split into coded pieces.
Codes: S<n>-R<n> / -N<n> / -E<n> (requirements, negative and edge cases), S<n>-EH (a story's Error Handling), S<n>-DESIGN, KD (Key
Decisions), PERM (permission matrix), TERM (Terminology), OV (Feature Overview), OOS (Out of Scope), §8-<n> (User Feedback rows)."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
PRD_PATH = os.path.normpath(os.path.join(HERE, '..', '..', 'sources', 'CONFLUENCE-942243841-read-2026-11-12.md'))
RAW = open(PRD_PATH, encoding='utf-8').read()


def _clean(s):
    s = s.replace('\\>', '>').replace('\\[', '[').replace('\\]', ']').replace('\\*', '*').replace('\\_', '_')
    s = s.replace('**', '')
    return s


TEXT = _clean(RAW)
PIECES = {}          # code -> text
_lines = TEXT.split('\n')
story = None; section = None; eh = 0; s8 = 0
for ln in _lines:
    m = re.match(r'### Story (\d+):', ln)
    if m: story = int(m.group(1)); section = 'story'; continue
    if ln.startswith('## 2.'): section = 'OV'; continue
    if ln.startswith('## 4.'): section = 'KD'; continue
    if ln.startswith('## 5.'): section = 'TERM'; continue
    if ln.startswith('## 8.'): section = 'S8'; continue
    if ln.startswith('## 9.'): section = None; continue
    if ln.startswith('**Out of Scope**') or ln.startswith('Out of Scope'): section = 'OOS'; continue
    m = re.match(r'- (S\d+-[RNE]\d+[a-z]?):\s*(.*)', ln)
    if m: PIECES[m.group(1)] = m.group(2); continue
    if section == 'story' and story and ln.startswith('Design:'):
        PIECES['S%d-DESIGN' % story] = ln[7:].strip(); continue
    if section == 'story' and story and ln.startswith('- ') and 'Error Handling' not in ln:
        # prerequisites and error-handling bullets
        PIECES.setdefault('S%d-EH' % story, '')
        PIECES['S%d-EH' % story] += ' ' + ln[2:]
        continue
    if section == 'S8' and ln.startswith('| ') and not ln.startswith('| Trigger') and not ln.startswith('| ---'):
        s8 += 1; PIECES['§8-%02d' % s8] = ln; continue
    if section in ('OV', 'KD', 'TERM', 'OOS') and ln.strip():
        PIECES[section] = PIECES.get(section, '') + ' ' + ln
    if section is None and ln.startswith('| ') and "'" in ln:
        PIECES['PERM'] = PIECES.get('PERM', '') + ' ' + ln
# the header table (Design row: "Where a frame and this text disagree, the text wins")
PIECES['HEADER'] = ' '.join(_lines[:8])


def find(phrase, case=True):
    """Codes whose text contains the phrase (exact letter case when case=True)."""
    out = []
    for k, v in PIECES.items():
        if (phrase in v) if case else (phrase.lower() in v.lower()):
            out.append(k)
    return out


def quote(code):
    return PIECES.get(code, '')


if __name__ == '__main__':
    print(len(PIECES), 'pieces'); print(sorted(PIECES)[:80])
    print(find('Close Work Order')[:10])
