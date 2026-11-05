#!/usr/bin/env python3
"""Собирает index.html из partials/ и chapters/. Запуск: python3 build.py"""
import glob, os, re
root = os.path.dirname(os.path.abspath(__file__))
rd = lambda p: open(os.path.join(root, p), encoding="utf-8").read()
BAND = '<div class="band">⚜ ❖ ⚜ ❖ ⚜ ❖ ⚜ ❖ ⚜ ❖ ⚜ ❖ ⚜ ❖ ⚜ ❖ ⚜</div>\n\n'
key = lambda p: int(re.findall(r"\d+", os.path.basename(p))[0])
files = sorted(glob.glob(os.path.join(root, "chapters", "ch*.html")), key=key)
body = BAND.join(open(f, encoding="utf-8").read().strip() + "\n\n" for f in files)
html = rd("partials/header.html") + "\n" + body + rd("partials/footer.html")
open(os.path.join(root, "index.html"), "w", encoding="utf-8").write(html)
print("index.html собран, глав:", len(files))
