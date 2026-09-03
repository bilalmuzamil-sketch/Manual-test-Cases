#!/usr/bin/env python3
"""Extract the visible text from a ShopView printed document (credit note, invoice, work order).

WHY THIS EXISTS. These PDFs are produced by a headless-browser renderer that embeds SUBSET TrueType
fonts and writes text as raw GLYPH IDS (`[<018d><0393>...] TJ`) with **no /ToUnicode map**. Every
ordinary extraction route therefore returns an empty string, which looks exactly like "the document has
no text" - a false negative of the kind that already cost this project one wrong conclusion about the
credit note. The glyph ids are recoverable: each embedded font carries its own `cmap` table
(unicode -> gid), so inverting it gives gid -> unicode.

Usage:  python3 build/testing-tools/pdf_text.py <file.pdf> [more.pdf ...]
Prints the text of each file in reading order (top-to-bottom, left-to-right per line).
"""
import re, sys, zlib, struct
from collections import defaultdict


def objects(data):
    """Return {objnum: (dict_text, stream_bytes_or_None)} for every indirect object."""
    out = {}
    for m in re.finditer(rb'(\d+)\s+\d+\s+obj\b(.*?)\bendobj', data, re.S):
        num, body = int(m.group(1)), m.group(2)
        sm = re.search(rb'stream\r?\n(.*?)\r?\nendstream', body, re.S)
        raw = sm.group(1) if sm else None
        head = body[:sm.start()] if sm else body
        if raw is not None and b'FlateDecode' in head:
            try:
                raw = zlib.decompress(raw)
            except Exception:
                pass
        out[num] = (head.decode('latin-1', 'replace'), raw)
    return out


def expand_object_streams(objs):
    """Most objects in these files live INSIDE /Type /ObjStm compressed streams, so a plain
    `N 0 obj ... endobj` scan finds only a handful (13 of them here) and every font lookup misses.
    Unpack each object stream into the same {objnum: (dict_text, None)} shape."""
    extra = {}
    for num, (head, raw) in list(objs.items()):
        if '/ObjStm' not in head or not raw:
            continue
        n = re.search(r'/N\s+(\d+)', head)
        first = re.search(r'/First\s+(\d+)', head)
        if not n or not first:
            continue
        n, first = int(n.group(1)), int(first.group(1))
        text = raw.decode('latin-1', 'replace')
        nums = text[:first].split()
        for i in range(n):
            try:
                on, off = int(nums[2 * i]), int(nums[2 * i + 1])
            except (IndexError, ValueError):
                break
            end = first + (int(nums[2 * i + 3]) if 2 * i + 3 < len(nums) else len(text) - first)
            extra[on] = (text[first + off:end], None)
    objs.update(extra)
    return objs


def tounicode_map(stream_bytes):
    """Parse a /ToUnicode CMap: the authoritative glyph -> text mapping when the producer supplies one.
    These files DO supply it - the earlier `'ToUnicode' in data` check missed it only because the font
    dictionaries live inside compressed object streams."""
    if not stream_bytes:
        return {}
    t = stream_bytes.decode('latin-1', 'replace')
    out = {}
    for blk in re.findall(r'beginbfchar(.*?)endbfchar', t, re.S):
        for src, dst in re.findall(r'<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>', blk):
            out[int(src, 16)] = ''.join(chr(int(dst[i:i + 4], 16)) for i in range(0, len(dst), 4))
    for blk in re.findall(r'beginbfrange(.*?)endbfrange', t, re.S):
        for lo, hi, dst in re.findall(r'<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>', blk):
            lo, hi, base = int(lo, 16), int(hi, 16), int(dst, 16)
            for k in range(min(hi - lo, 65535) + 1):
                out[lo + k] = chr(base + k)
    return out


def ttf_gid_to_unicode(font):
    """Invert an embedded TrueType font's cmap: glyph id -> unicode character."""
    if len(font) < 12:
        return {}
    numtables = struct.unpack('>H', font[4:6])[0]
    tables = {}
    for i in range(numtables):
        off = 12 + 16 * i
        if off + 16 > len(font):
            break
        tag, _, o, l = struct.unpack('>4sIII', font[off:off + 16])
        tables[tag] = (o, l)
    if b'cmap' not in tables:
        return {}
    co, _ = tables[b'cmap']
    if co + 4 > len(font):
        return {}
    n = struct.unpack('>H', font[co + 2:co + 4])[0]
    best = None
    for i in range(n):
        p = co + 4 + 8 * i
        if p + 8 > len(font):
            break
        pid, eid, off = struct.unpack('>HHI', font[p:p + 8])
        if (pid, eid) in ((3, 1), (3, 10), (0, 3), (0, 4), (0, 6)):
            best = co + off
            break
        if best is None:
            best = co + off
    if best is None or best + 4 > len(font):
        return {}
    fmt = struct.unpack('>H', font[best:best + 2])[0]
    g2u = {}
    if fmt == 4:
        segx2 = struct.unpack('>H', font[best + 6:best + 8])[0]
        seg = segx2 // 2
        base = best + 14
        ends = struct.unpack('>%dH' % seg, font[base:base + segx2])
        starts = struct.unpack('>%dH' % seg, font[base + segx2 + 2:base + 2 * segx2 + 2])
        deltas = struct.unpack('>%dh' % seg, font[base + 2 * segx2 + 2:base + 3 * segx2 + 2])
        ro_at = base + 3 * segx2 + 2
        ros = struct.unpack('>%dH' % seg, font[ro_at:ro_at + segx2])
        for i in range(seg):
            for c in range(starts[i], min(ends[i], 0xFFFF) + 1):
                if ros[i] == 0:
                    gid = (c + deltas[i]) & 0xFFFF
                else:
                    gi = ro_at + 2 * i + ros[i] + 2 * (c - starts[i])
                    if gi + 2 > len(font):
                        continue
                    gid = struct.unpack('>H', font[gi:gi + 2])[0]
                    if gid:
                        gid = (gid + deltas[i]) & 0xFFFF
                if gid and gid not in g2u:
                    g2u[gid] = chr(c)
    elif fmt == 12:
        ngroups = struct.unpack('>I', font[best + 12:best + 16])[0]
        for i in range(ngroups):
            p = best + 16 + 12 * i
            s, e, sg = struct.unpack('>III', font[p:p + 12])
            for k in range(min(e - s, 4000) + 1):
                g2u.setdefault(sg + k, chr(s + k))
    return g2u


def extract(path, collect=None):
    data = open(path, 'rb').read()
    objs = expand_object_streams(objects(data))

    def ref(text, key):
        m = re.search(r'/%s\s+(\d+)\s+\d+\s+R' % key, text)
        return int(m.group(1)) if m else None

    # resource NAME -> font object number. /Font is EITHER an inline dictionary or an indirect
    # reference to one (`/Font 27 0 R`), which is what this renderer emits - handle both.
    name_to_obj = {}

    def harvest(dict_text):
        for nm, on in re.findall(r'/([A-Za-z0-9+.#-]+)\s+(\d+)\s+\d+\s+R', dict_text):
            name_to_obj[nm] = int(on)

    for num, (head, _) in objs.items():
        for fm in re.finditer(r'/Font\s*<<(.*?)>>', head, re.S):
            harvest(fm.group(1))
        m = re.search(r'/Font\s+(\d+)\s+\d+\s+R', head)
        if m and int(m.group(1)) in objs:
            harvest(objs[int(m.group(1))][0])

    def font_program(objnum):
        """Font -> (DescendantFonts ->) FontDescriptor -> FontFile2, following the refs."""
        seen = set()
        stack = [objnum]
        while stack:
            n = stack.pop()
            if n in seen or n not in objs:
                continue
            seen.add(n)
            head, _ = objs[n]
            ff = ref(head, 'FontFile2') or ref(head, 'FontFile3')
            if ff and objs.get(ff, (None, None))[1]:
                return objs[ff][1]
            fd = ref(head, 'FontDescriptor')
            if fd:
                stack.append(fd)
            for d in re.findall(r'/DescendantFonts\s*\[\s*(\d+)\s+\d+\s+R', head):
                stack.append(int(d))
        return None

    fontmaps = {}
    for nm, on in name_to_obj.items():
        tu = ref(objs.get(on, ('', None))[0], 'ToUnicode')
        mp = tounicode_map(objs.get(tu, (None, None))[1]) if tu else {}
        if not mp:                       # no /ToUnicode - fall back to inverting the font's own cmap
            prog = font_program(on)
            mp = ttf_gid_to_unicode(prog) if prog else {}
        if mp:
            fontmaps[nm] = mp
    default = {}
    for v in fontmaps.values():
        default.update(v)

    TOK = re.compile(
        r'/(?P<font>[A-Za-z0-9+.#-]+)\s+[\d.]+\s+Tf'
        r'|(?:[-\d.]+\s+){4}(?P<x>[-\d.]+)\s+(?P<y>[-\d.]+)\s+Tm'
        r'|\[(?P<tj>[^\]]*)\]\s*TJ'
        r'|\((?P<lit>(?:[^()\\]|\\.)*)\)\s*Tj', re.S)

    lines = defaultdict(list)
    for num, (head, raw) in objs.items():
        if not raw or b'BT' not in raw:
            continue
        c = raw.decode('latin-1', 'replace')
        cur, x, y = default, 0.0, 0.0
        for t in TOK.finditer(c):
            if t.group('font'):
                cur = fontmaps.get(t.group('font'), default)
            elif t.group('y') is not None:
                x, y = float(t.group('x')), float(t.group('y'))
            elif t.group('tj') is not None:
                s = ''
                for blob in re.findall(r'<([0-9a-fA-F]+)>', t.group('tj')):
                    for i in range(0, len(blob) - 3, 4):
                        s += cur.get(int(blob[i:i + 4], 16), '')
                if s.strip():
                    lines[round(y, 1)].append((x, s))
                    if collect is not None:
                        collect.append((round(y, 2), round(x, 2), s))
            elif t.group('lit') is not None:
                s = re.sub(r'\\(.)', r'\1', t.group('lit'))
                if s.strip():
                    lines[round(y, 1)].append((x, s))
                    if collect is not None:
                        collect.append((round(y, 2), round(x, 2), s))

    out = []
    for yy in sorted(lines):
        out.append('  '.join(txt for _, txt in sorted(lines[yy])))
    return '\n'.join(out)


def positions(path):
    """Same decode, but keep each run's x/y so LAYOUT questions can be answered - e.g. 'does the
    Credit To block span the full width, or is something sitting beside it?'. Text extraction alone
    cannot answer those, which is why one assertion stayed NOT VERIFIED on 2026-09-02."""
    import io
    buf, out = io.StringIO(), []
    real_print = print
    # reuse extract's machinery by re-running it with a collector
    global _COLLECT
    _COLLECT = out
    extract(path, collect=out)
    return out


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    want_pos = '--positions' in sys.argv
    for p in args:
        print(f'===== {p} =====')
        if want_pos:
            runs = []
            extract(p, collect=runs)
            for y, x, t in sorted(runs):
                print(f'  y={y:8.2f}  x={x:8.2f}  {t}')
        else:
            print(extract(p))
