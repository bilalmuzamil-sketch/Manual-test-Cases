"""Turn a Playwright session recording into the MP4 that goes at the bottom of a Jira QA comment.

usage: python3 finish_recording.py <video.webm> <startSec> <out.mp4> [--width 1280] [--crf 28]

- trims everything before <startSec> (the login / wake-up), so the film opens on the app
- H.264 + yuv420p + faststart: plays inline in Jira's media viewer and every browser
- prints duration, size and resolution so the pre-post gate can record them
"""
import json, subprocess, sys
import imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()


def finish(src, start, out, width=1280, crf=28):
    # start 0.6 s AFTER the logged-in moment: the video timeline lags the wall clock, and a pre-roll
    # left the sign-in page in frame 0 (SV-9828, 2026-10-07) - which Jira then used as the preview image.
    cmd = [FF, '-y', '-loglevel', 'error', '-ss', f'{float(start) + 0.6:.2f}', '-i', src,
           '-vf', f'scale={width}:-2:flags=lanczos,fps=25', '-c:v', 'libx264', '-preset', 'medium',
           '-crf', str(crf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out]
    subprocess.run(cmd, check=True)
    probe = subprocess.run([FF, '-i', out], capture_output=True, text=True).stderr
    dur = probe.split('Duration: ')[1].split(',')[0] if 'Duration: ' in probe else '?'
    import os
    info = {'file': out, 'duration': dur, 'bytes': os.path.getsize(out), 'width': width}
    print(json.dumps(info))
    return info


if __name__ == '__main__':
    a = sys.argv[1:]
    w = int(a[a.index('--width') + 1]) if '--width' in a else 1280
    c = int(a[a.index('--crf') + 1]) if '--crf' in a else 28
    finish(a[0], a[1], a[2], w, c)
