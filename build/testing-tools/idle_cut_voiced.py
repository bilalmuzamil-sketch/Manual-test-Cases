"""Cut the idle pauses out of a VOICED QA film without touching the voice (Standing Rules 104 + 107).

usage: python3 idle_cut_voiced.py <in.mp4> <in.mp4.anchors.json> <durs.json> <out.mp4> [--hold 1.5] [--end-hold 2.0]

anchor_mux.py lays each voice line at the moment its caption appears, so a film can still carry long
still stretches between lines (page loads, a location switch, waiting for a re-render). finish_recording.py
cuts those on a silent film; this does the same on a voiced one:
- finds every stretch where the picture is still for longer than --hold (top 8% ignored, as finish_recording)
- never cuts inside a spoken line (offset .. offset + line length + 0.3 s)
- shortens every remaining still piece to --hold (the last one to --end-hold)
- cuts picture and sound together, so the voice stays on its caption
Prints before/after length, seconds removed and the new offsets of each line.
"""
import json, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from finish_recording import FF, _duration, _still_spans


def main(src, anchors, durs, out, hold=1.5, end_hold=2.0):
    off = json.load(open(anchors))['offsets']; D = json.load(open(durs))
    voice = sorted((off[k], off[k] + D[k] + 0.3) for k in off)
    spans, total = _still_spans(src, hold)
    cut = []
    for s, e in spans:
        pieces, t = [], s
        for a, b in voice:
            if b <= t or a >= e: continue
            if a > t: pieces.append((t, a))
            t = max(t, b)
        if t < e: pieces.append((t, e))
        for ps, pe in pieces:
            allow = end_hold if pe >= total - 0.05 else hold
            if pe - ps > allow: cut.append((ps + allow, pe))
    cut.sort(); keep, t = [], 0.0
    for s, e in cut:
        if s > t: keep.append((t, s))
        t = max(t, e)
    if t < total: keep.append((t, total))
    expr = '+'.join(f'between(t,{a:.3f},{b:.3f})' for a, b in keep)
    subprocess.run([FF, '-y', '-loglevel', 'error', '-i', src,
                    '-vf', f"select='{expr}',setpts=N/FRAME_RATE/TB", '-af', f"aselect='{expr}',asetpts=N/SR/TB",
                    '-r', '25', '-c:v', 'libx264', '-preset', 'medium', '-crf', '28', '-pix_fmt', 'yuv420p',
                    '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out], check=True)
    shift = lambda x: sum(min(e, x) - s for s, e in cut if s < x)
    new = {k: round(v - shift(v), 2) for k, v in off.items()}
    dec = subprocess.run([FF, '-v', 'error', '-i', out, '-f', 'null', '-'], capture_output=True, text=True)
    info = {'file': out, 'duration_before_s': round(total, 1), 'duration_s': round(_duration(out), 1),
            'idle_removed_s': round(sum(e - s for s, e in cut), 1), 'still_stretches_cut': len(cut),
            'new_offsets': new, 'decode_ok': dec.returncode == 0 and not dec.stderr.strip(), 'bytes': os.path.getsize(out)}
    print(json.dumps(info))
    return info


if __name__ == '__main__':
    a = sys.argv[1:]
    opt = lambda k, d: float(a[a.index(k) + 1]) if k in a else d
    main(a[0], a[1], a[2], a[3], opt('--hold', 1.5), opt('--end-hold', 2.0))
