"""Build downloadable notes PDFs (no headers, no watermark).
Run from repo root: python3 scripts/build-notes-pdfs.py"""
import os, re, pathlib
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
COURSES = {"consulting": "index.html", "agentic": "agentic-patterns.html", "handbook": "handbook.html"}

def ids_for(page):
    return page.evaluate("(window.NOTES||[]).map(function(n){return n[0]})")

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(color_scheme="light")
    for course, html in COURSES.items():
        out = ROOT / "pdf" / course; out.mkdir(parents=True, exist_ok=True)
        pg = ctx.new_page()
        url = (ROOT / html).as_uri()
        pg.goto(url + "#notes/print/all"); pg.wait_for_function("window.__notesReady===true", timeout=20000)
        ids = ids_for(pg)
        for i in ids + ["all"]:
            pg.goto("about:blank"); pg.goto(url + "#notes/print/" + i)
            pg.wait_for_function("window.__notesReady===true", timeout=20000)
            pg.emulate_media(media="print", color_scheme="light")
            pg.pdf(path=str(out / f"{i}.pdf"), format="A4", print_background=True,
                   display_header_footer=False, margin={"top":"14mm","bottom":"14mm","left":"14mm","right":"14mm"})
        print(course, len(ids) + 1, "pdfs")
    b.close()
