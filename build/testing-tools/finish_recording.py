"""Turn a Playwright session recording into the MP4 that goes at the bottom of a Jira QA comment.

usage: python3 finish_recording.py <video.webm> <startSec> <out.mp4> [--width 1280] [--crf 28]
                                   [--hold 0.8] [--end-hold 2.0] [--keep-idle]

- trims everything before <startSec> (the login / wake-up), so the film opens on the app
- CUTS THE IDLE PAUSES (Standing Rule 107, QA lead 2026-10-16): every stretch where nothing on the
  screen changes for longer than --hold seconds is shortened to --hold seconds, so the film shows only
  the activity, back to back. The very last still stretch keeps --end-hold seconds so the final result
  can be read. --keep-idle switches this off (never use it for a Jira recording).
- H.264 + yuv420p + faststart: plays inline in Jira's media viewer and every browser
- prints duration before/after, idle removed, size and resolution so the pre-post gate can record them
"""
import json, os, re, subprocess, sys
import imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()


def _duration(path):
    probe = subprocess.run([FF, '-i', path], capture_output=True, text=True).stderr
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', probe)
    return int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3]) if m else 0.0


def _still_spans(path, min_still):
    """Return [(start, end)] of every stretch where the picture does not change for >= min_still s."""
    err = subprocess.run([FF, '-i', path, '-vf', f'freezedetect=n=0.0008:d={min_still}', '-map', '0:v',
                          '-f', 'null', '-'], capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r'freeze_start: ([\d.]+)', err)]
    ends = [float(x) for x in re.findall(r'freeze_end: ([\d.]+)', err)]
    total = _duration(path)
    spans = []
    for i, s in enumerate(starts):
        spans.append((s, ends[i] if i < len(ends) else total))
    return spans, total


def finish(src, start, out, width=1280, crf=28, hold=0.8, end_hold=2.0, keep_idle=False):
    # start 0.6 s AFTER the logged-in moment: the video timeline lags the wall clock, and a pre-roll
    # left the sign-in page in frame 0 (SV-9828, 2026-10-07) - which Jira then used as the preview image.
    tmp = out + '.trim.mp4'
    subprocess.run([FF, '-y', '-loglevel', 'error', '-ss', f'{float(start) + 0.6:.2f}', '-i', src,
                    '-vf', f'scale={width}:-2:flags=lanczos,fps=25', '-c:v', 'libx264', '-preset', 'veryfast',
                    '-crf', '18', '-pix_fmt', 'yuv420p', '-an', tmp], check=True)
    spans, total = _still_spans(tmp, hold)
    # keep everything except the part of each still stretch beyond its allowed hold
    cut = []
    for i, (s, e) in enumerate(spans):
        allow = end_hold if e >= total - 0.05 else hold
        if not keep_idle and e - s > allow:
            cut.append((s + allow, e))
    if cut:
        keep, t = [], 0.0
        for s, e in cut:
            if s > t:
                keep.append((t, s))
            t = e
        if t < total:
            keep.append((t, total))
        expr = '+'.join(f'between(t,{a:.3f},{b:.3f})' for a, b in keep)
        vf = f"select='{expr}',setpts=N/FRAME_RATE/TB"
    else:
        vf = 'null'
    subprocess.run([FF, '-y', '-loglevel', 'error', '-i', tmp, '-vf', vf, '-r', '25', '-c:v', 'libx264',
                    '-preset', 'medium', '-crf', str(crf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
                    '-an', out], check=True)
    os.remove(tmp)
    after = _duration(out)
    info = {'file': out, 'duration_before_s': round(total, 1), 'duration_s': round(after, 1),
            'idle_removed_s': round(total - after, 1), 'still_stretches_cut': len(cut),
            'longest_still_left_s': hold, 'bytes': os.path.getsize(out), 'width': width}
    print(json.dumps(info))
    return info


if __name__ == '__main__':
    a = sys.argv[1:]
    opt = lambda k, d: type(d)(a[a.index(k) + 1]) if k in a else d
    finish(a[0], a[1], a[2], opt('--width', 1280), opt('--crf', 28), opt('--hold', 0.8),
           opt('--end-hold', 2.0), '--keep-idle' in a)
