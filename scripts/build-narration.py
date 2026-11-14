"""Generate missing lesson narration in the same voice as the existing audio.

Voice: Kokoro v1.0, am_michael, speed 1.0, 24 kHz mono MP3 at 48 kbps.
Text: each lesson's title + body (.prose) as rendered by the app.
Only lessons without an MP3 in audio/<course>/ are generated.

Setup (once):
  pip install kokoro-onnx soundfile playwright
  download kokoro-v1.0.onnx and voices-v1.0.bin from
  https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
Run from repo root:
  python3 scripts/build-narration.py --models /path/to/model/dir
"""
import argparse, pathlib, re, subprocess, tempfile
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
COURSES = {"consulting": "index.html", "agentic": "agentic-patterns.html", "handbook": "handbook.html"}
SUBS = {"—": ", ", "→": " to ", "×": " times ", "≈": "about ", "&": " and "}

ap = argparse.ArgumentParser(); ap.add_argument("--models", default="."); a = ap.parse_args()
md = pathlib.Path(a.models)

todo = []
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    for course, html in COURSES.items():
        url = (ROOT / html).as_uri(); pg.goto(url); pg.wait_for_timeout(500)
        for mid, lid in pg.evaluate("MODULES.flatMap(m=>m.lessons.map(l=>[m.id,l.id]))"):
            out = ROOT / "audio" / course / f"{mid}-{lid}.mp3"
            if out.exists(): continue
            pg.evaluate("h=>{location.hash=h}", f"lesson/{mid}/{lid}"); pg.wait_for_timeout(250)
            text = pg.evaluate("""()=>{const v=document.getElementById('view');
              const pr=v.querySelector('.prose').cloneNode(true);pr.querySelectorAll('pre,svg').forEach(e=>e.remove());
              return v.querySelector('.h-hero').innerText+'.\\n\\n'+pr.innerText}""")
            todo.append((out, text))
    b.close()

if not todo: print("All lessons already have narration."); raise SystemExit
k = Kokoro(str(md / "kokoro-v1.0.onnx"), str(md / "voices-v1.0.bin"))
gap = np.zeros(int(24000 * 0.45), dtype=np.float32)
for out, text in todo:
    parts = []
    for para in [re.sub(r"\s+", " ", x).strip() for x in text.split("\n") if x.strip()]:
        for s, r in SUBS.items(): para = para.replace(s, r)
        y, _ = k.create(para, voice="am_michael", speed=1.0, lang="en-us")
        parts += [y.astype(np.float32), gap]
    with tempfile.NamedTemporaryFile(suffix=".wav") as w:
        sf.write(w.name, np.concatenate(parts), 24000)
        out.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", w.name, "-ac", "1", "-ar", "24000", "-b:a", "48k", str(out)], check=True)
    print("wrote", out.relative_to(ROOT))
