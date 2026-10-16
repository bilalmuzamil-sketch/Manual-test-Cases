"""Make the voice-over clips for a QA screen recording (Standing Rule 104, voice-over amendment 2026-10-16).

usage: python3 narrate.py <script.json> <out_dir> [--voice en-US-AriaNeural] [--rate +0%]

script.json = [{"id": "s1", "text": "..."}, ...]  ->  <out_dir>/<id>.mp3 for each line, and prints each clip's
length in seconds as JSON, so the film can be cut to give every line enough screen time.

Voice: a professional female narrator (Microsoft neural, en-US-AriaNeural by default; en-US-JennyNeural and
en-GB-SoniaNeural also suit). This container reaches the service through an intercepting proxy, so the proxy's
CA bundle (/root/.ccr/ca-bundle.crt) is loaded into the connection alongside the normal certificates.
"""
import asyncio, json, os, re, ssl, subprocess, sys

import certifi
import edge_tts
import edge_tts.communicate as comm
import imageio_ffmpeg

CTX = ssl.create_default_context(cafile=certifi.where())
if os.path.exists('/root/.ccr/ca-bundle.crt'):
    CTX.load_verify_locations('/root/.ccr/ca-bundle.crt')
comm._SSL_CTX = CTX
FF = imageio_ffmpeg.get_ffmpeg_exe()


def _dur(path):
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', subprocess.run([FF, '-i', path], capture_output=True, text=True).stderr)
    return int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])


async def _one(text, out, voice, rate):
    await edge_tts.Communicate(text, voice, rate=rate).save(out)


def main(script, out_dir, voice='en-US-AriaNeural', rate='+0%'):
    os.makedirs(out_dir, exist_ok=True)
    lines = json.load(open(script))
    result = {}
    for ln in lines:
        out = os.path.join(out_dir, ln['id'] + '.mp3')
        asyncio.run(_one(ln['text'], out, voice, rate))
        result[ln['id']] = round(_dur(out), 2)
    print(json.dumps(result))
    return result


def mux(video, trim_start, offsets, clips_dir, out, total, width=1280):
    """Cut the film to start at trim_start (seconds into the raw recording), lay each clip <id>.mp3 at
    offsets[id] seconds, and write an H.264 + AAC MP4 of `total` seconds that plays inline in Jira.
    Film each step so it holds for its sentence's length: then the voice covers every still moment and the
    Rule-107 idle cut is not needed (it would cut the narrated holds)."""
    ids = list(offsets)
    cmd = [FF, '-y', '-loglevel', 'error', '-ss', f'{trim_start:.3f}', '-t', f'{total:.3f}', '-i', video]
    for i in ids:
        cmd += ['-i', os.path.join(clips_dir, i + '.mp3')]
    parts = [f'[{n + 1}:a]adelay={int(offsets[i] * 1000)}|{int(offsets[i] * 1000)},volume=1.0[a{n}]' for n, i in enumerate(ids)]
    mix = ''.join(f'[a{n}]' for n in range(len(ids))) + f'amix=inputs={len(ids)}:normalize=0,apad[aout]'
    vf = f'[0:v]scale={width}:-2:flags=lanczos,fps=25[vout]'
    cmd += ['-filter_complex', ';'.join(parts + [mix, vf]), '-map', '[vout]', '-map', '[aout]', '-t', f'{total:.3f}',
            '-c:v', 'libx264', '-preset', 'medium', '-crf', '26', '-pix_fmt', 'yuv420p',
            '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out]
    subprocess.run(cmd, check=True)
    info = {'file': out, 'duration_s': round(_dur(out), 1), 'bytes': os.path.getsize(out)}
    print(json.dumps(info))
    return info


if __name__ == '__main__':
    a = sys.argv[1:]
    opt = lambda k, d: a[a.index(k) + 1] if k in a else d
    main(a[0], a[1], opt('--voice', 'en-US-AriaNeural'), opt('--rate', '+0%'))
