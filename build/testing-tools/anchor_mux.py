"""Lay a voice-over on a QA screen recording, anchored to the captions as they appear IN THE FILM
(Standing Rule 104 + playbook §AK step 5d).

Why: on heavy screens (Board View, Tech View) Playwright's video stalls during re-renders, so the film
drifts 1-3.5 s behind Date.now(). Anchoring each voice line to the moment its caption actually appears
in the raw .webm keeps the voice and the caption together.

usage: python3 anchor_mux.py <run.json> <clips_dir> <out.mp4> [--ids n1,n2,...] [--tail 1.0] [--fix n5=137.3]
  --fix: pin a line to a caption time you read off the check image / changes list (a page navigation also
         changes the caption strip and can be taken for the caption - SV-11320 line 5)
  run.json : {"r": {"video": "<raw .webm>"}, "ev": {"n1": ms, ...}}   (written by the recording script)
  clips_dir: <id>.mp3 from narrate.py, plus durs.json in its parent folder (or --durs path)
Writes <out.mp4>, <out>.check.png (caption strip 0.3 s after each voice onset) and prints
anchors, offsets and per-line loudness. LOOK at the check image before posting.
"""
import json, os, subprocess, sys, glob, shutil, tempfile
import imageio_ffmpeg
from PIL import Image, ImageChops, ImageStat
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import narrate

FF = imageio_ffmpeg.get_ffmpeg_exe()


def caption_changes(video, w, h, fps=10, thr=5.0):
    """Times (s) where the caption strip at the bottom of the frame changes."""
    tmp = tempfile.mkdtemp()
    cw, ch = int(w * 0.62), 110
    x, y = (w - cw) // 2, h - 130
    subprocess.run([FF, '-v', 'error', '-i', video, '-vf', f'fps={fps},crop={cw}:{ch}:{x}:{y},scale=300:-1,format=gray',
                    f'{tmp}/%05d.png'], check=True)
    fs = sorted(glob.glob(f'{tmp}/*.png')); prev = None; out = []
    for i, f in enumerate(fs):
        im = Image.open(f)
        if prev is not None:
            d = ImageStat.Stat(ImageChops.difference(im, prev)).mean[0]
            if d > thr: out.append((round(i / fps, 2), round(d, 1)))
        prev = im
    shutil.rmtree(tmp)
    return out


def anchors_for(run, changes, ids):
    """Match each step to the first caption change at or after its wall-clock estimate (estimates are
    re-based on the first caption, which is the large jump from 'no caption' to 'caption')."""
    ev = run['ev']; t0 = ev[ids[0]]
    big = [t for t, d in changes if d > 60]
    first = big[0] if big else changes[0][0]
    est = {k: first + (ev[k] - t0) / 1000 for k in ids}
    res = {ids[0]: first}; last = first
    for k in ids[1:]:
        cand = [t for t, d in changes if t > last + 0.8 and t >= est[k] - 0.6]
        res[k] = cand[0] if cand else est[k]
        last = res[k]
    return res


def main(run_path, clips, out, ids=None, tail=1.0, durs_path=None, fix=None):
    run = json.load(open(run_path)); video = run['r']['video']
    ids = ids or list(run['ev'].keys())
    durs = json.load(open(durs_path or os.path.join(os.path.dirname(clips.rstrip('/')), 'durs.json')))
    probe = subprocess.run([FF, '-i', video], capture_output=True, text=True).stderr
    import re
    w, h = map(int, re.search(r', (\d{3,4})x(\d{3,4})', probe).groups())
    ch = caption_changes(video, w, h)
    A = anchors_for(run, ch, ids)
    for k, v in (fix or {}).items(): A[k] = v  # manual anchor where a page change was taken for a caption
    start = A[ids[0]] - 0.3
    off = {k: round(A[k] - start + 0.2, 2) for k in ids}
    total = A[ids[-1]] - start + durs[ids[-1]] + tail
    for i, k in enumerate(ids[:-1]):
        gap = A[ids[i + 1]] - A[k]
        if gap < durs[k] + 0.2: print(f'WARNING: {k} has {gap:.1f}s before the next caption but its line is {durs[k]:.1f}s')
    info = narrate.mux(video, start, off, clips, out, total)
    ims = []
    for k in ids:
        f = out + f'.{k}.png'
        subprocess.run([FF, '-v', 'error', '-y', '-ss', str(off[k] + 0.3), '-i', out, '-frames:v', '1', '-vf', f'crop=1280:150:0:{int(1280 * h / w) - 150}', f])
        ims.append(Image.open(f))
        r = subprocess.run([FF, '-ss', str(off[k]), '-t', '2', '-i', out, '-af', 'volumedetect', '-vn', '-f', 'null', '-'], capture_output=True, text=True).stderr
        vol = [l.split('mean_volume:')[1].strip() for l in r.splitlines() if 'mean_volume' in l]
        print(k, 'anchor', A[k], 'offset', off[k], 'loudness', vol)
        os.remove(f)
    o = Image.new('RGB', (1280, 150 * len(ims)), 'white')
    for i, im in enumerate(ims): o.paste(im, (0, 150 * i))
    o.save(out + '.check.png')
    dec = subprocess.run([FF, '-v', 'error', '-i', out, '-f', 'null', '-'], capture_output=True, text=True)
    print(json.dumps({'out': out, 'duration_s': info['duration_s'], 'decode_ok': dec.returncode == 0 and not dec.stderr.strip(), 'check': out + '.check.png'}))
    json.dump({'anchors': A, 'offsets': off, 'changes': ch}, open(out + '.anchors.json', 'w'), indent=1)
    return off


if __name__ == '__main__':
    a = sys.argv[1:]
    opt = lambda k, d: a[a.index(k) + 1] if k in a else d
    ids = opt('--ids', None)
    fx = opt('--fix', None)  # e.g. n5=137.3,n6=150.2 : use when a page navigation changed the caption strip first
    fix = {k: float(v) for k, v in (x.split('=') for x in fx.split(','))} if fx else None
    main(a[0], a[1], a[2], ids.split(',') if ids else None, float(opt('--tail', '1.0')), opt('--durs', None), fix)
