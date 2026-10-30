import html
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "og"
LOGO = (ROOT / "assets" / "images" / "logo-stacked.svg").read_text()
CHROME_CANDIDATES = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "google-chrome",
    "chromium",
]

TEMPLATE = """<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600&family=Mulish:wght@700&display=swap" rel="stylesheet">
<style>
html, body {{ margin: 0; width: 1200px; height: 630px; }}
body {{ background: #C4E1FE; color: #363330; font-family: Mulish, sans-serif; display: flex; flex-direction: column; justify-content: space-between; padding: 64px 72px; box-sizing: border-box; }}
.logo svg {{ height: 72px; width: auto; display: block; }}
h1 {{ font-family: Poppins, sans-serif; font-weight: 600; font-size: {size}px; line-height: 1.08; letter-spacing: -0.02em; margin: 0; max-width: 1000px; }}
.fact {{ align-self: flex-start; background: #FCF0CA; border: 3px solid #363330; border-radius: 999px; box-shadow: 6px 6px 0 #363330; padding: 14px 30px; font-size: 32px; font-weight: 700; }}
.site {{ font-size: 26px; font-weight: 700; }}
</style></head>
<body>
<div class="logo">{logo}</div>
<h1>{title}</h1>
{fact}
</body></html>
"""


def chrome():
    for candidate in CHROME_CANDIDATES:
        path = shutil.which(candidate) or (candidate if Path(candidate).exists() else None)
        if path:
            return path
    raise SystemExit("Chrome not found")


def render(binary, entry, workdir):
    title = entry["title"].split(" | ")[0]
    fact = entry["alt"] if entry["alt"] != title else ""
    size = 72 if len(title) <= 48 else 60
    fact_html = f'<div class="fact">{html.escape(fact)}</div>' if fact else '<div class="site">pricetohours.com</div>'
    page = workdir / f"{entry['og']}.html"
    page.write_text(TEMPLATE.format(size=size, logo=LOGO, title=html.escape(title), fact=fact_html))
    target = OUT / f"{entry['og']}.png"
    subprocess.run(
        [binary, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=4000",
         "--window-size=1200,630", f"--screenshot={target}", page.as_uri()],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    entries = json.loads((ROOT / "src" / "og-pages.json").read_text())
    unique = {entry["og"]: entry for entry in reversed(entries)}
    binary = chrome()
    with tempfile.TemporaryDirectory() as directory:
        for entry in unique.values():
            render(binary, entry, Path(directory))
    print(f"{len(unique)} images")


if __name__ == "__main__":
    main()
