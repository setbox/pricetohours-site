import html
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
SITE = "https://pricetohours.com"
SITE_NAME = "Price to Hours"
TODAY = "2026-10-30"
TODAY_LABEL = "October 30, 2026"
AUTHOR = {"@type": "Person", "name": "Jackson Teixeira", "url": f"{SITE}/about/#author"}
ORGANIZATION = {
    "@type": "Organization",
    "name": "Setbox",
    "url": "https://setbox.com.br",
    "email": "contato@setbox.com.br",
    "logo": f"{SITE}/assets/icons/android-chrome-512x512.png",
}
NAV = [
    ("/", "Calculator"),
    ("/salary/", "Salary"),
    ("/cost/", "What things cost"),
    ("/guides/", "Guides"),
    ("/about/", "About"),
]
LADDER = [7.25, 15, 20, 25, 30, 50]
TABLE_WAGES = [15, 20, 30]
CONSENT_REGIONS = "'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH'"


def esc(text):
    return html.escape(str(text), quote=True)


def number(value):
    rounded = round(value, 1)
    if rounded == int(rounded):
        return f"{int(rounded):,}"
    return f"{rounded:,.1f}"


def hours_parts(hours):
    minutes = round(hours * 60)
    if minutes < 60:
        count = max(1, minutes)
        return str(count), "minute" if count == 1 else "minutes"
    if hours < 100:
        figure = number(hours)
    else:
        figure = f"{round(hours):,}"
    return figure, "hour" if figure == "1" else "hours"


def hours_short(hours):
    figure, unit = hours_parts(hours)
    return f"{figure} min" if unit.startswith("minute") else f"{figure} h"


def cap(name):
    return name if name[:1].isupper() or name.startswith("iP") else name[0].upper() + name[1:]


def money(value):
    if value == int(value):
        return f"${int(value):,}"
    return f"${value:,.2f}"


def words(markup):
    text = re.sub(r"<[^>]+>", " ", markup)
    return len(re.findall(r"[A-Za-z0-9$']+", text))


def read_time(markup):
    return max(1, math.ceil(words(markup) / 230))


def load(name):
    return json.loads((SRC / name).read_text())


def jsonld(data):
    payload = json.dumps(data, ensure_ascii=False, indent=2)
    return f'    <script type="application/ld+json">\n{payload}\n    </script>'


def breadcrumb_schema(crumbs):
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": name, "item": f"{SITE}{url}"}
            for i, (name, url) in enumerate(crumbs)
        ],
    }


def breadcrumb_nav(crumbs):
    links = []
    for name, url in crumbs[:-1]:
        links.append(f'<li><a href="{url}">{esc(name)}</a></li>')
    links.append(f'<li aria-current="page">{esc(crumbs[-1][0])}</li>')
    return f'<nav class="breadcrumb" aria-label="Breadcrumb"><ol>{"".join(links)}</ol></nav>'


def article_schema(page, description):
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": page["h1"],
        "description": description,
        "image": f"{SITE}/assets/og/{page['og']}.png",
        "datePublished": page.get("published", TODAY),
        "dateModified": page.get("modified", TODAY),
        "author": AUTHOR,
        "publisher": ORGANIZATION,
        "mainEntityOfPage": f"{SITE}{page['path']}",
    }


def head(page):
    url = f"{SITE}{page['path']}"
    image = f"{SITE}/assets/og/{page['og']}.png"
    og_type = "article" if page.get("article") else "website"
    lines = [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '    <meta charset="UTF-8">',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        f"    <title>{esc(page['title'])}</title>",
        f'    <meta name="description" content="{esc(page["description"])}">',
        f'    <link rel="canonical" href="{url}">',
        f'    <meta property="og:site_name" content="{SITE_NAME}">',
        '    <meta property="og:locale" content="en_US">',
        f'    <meta property="og:type" content="{og_type}">',
        f'    <meta property="og:title" content="{esc(page.get("og_title", page["title"]))}">',
        f'    <meta property="og:description" content="{esc(page["description"])}">',
        f'    <meta property="og:url" content="{url}">',
        f'    <meta property="og:image" content="{image}">',
        '    <meta property="og:image:type" content="image/png">',
        '    <meta property="og:image:width" content="1200">',
        '    <meta property="og:image:height" content="630">',
        f'    <meta property="og:image:alt" content="{esc(page["og_alt"])}">',
    ]
    if page.get("article"):
        lines.append(f'    <meta property="article:published_time" content="{page.get("published", TODAY)}">')
        lines.append(f'    <meta property="article:modified_time" content="{page.get("modified", TODAY)}">')
    lines += [
        '    <meta name="twitter:card" content="summary_large_image">',
        f'    <meta name="twitter:title" content="{esc(page.get("og_title", page["title"]))}">',
        f'    <meta name="twitter:description" content="{esc(page["description"])}">',
        f'    <meta name="twitter:image" content="{image}">',
        f'    <meta name="twitter:image:alt" content="{esc(page["og_alt"])}">',
        "",
        '    <link rel="icon" href="/favicon.ico" sizes="48x48">',
        '    <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png">',
        '    <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png">',
        '    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
        '    <link rel="manifest" href="/site.webmanifest">',
        "",
        '    <link rel="preconnect" href="https://fonts.googleapis.com">',
        '    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
        '    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600&family=Mulish:wght@400;600;700;800&display=swap" rel="stylesheet">',
        '    <link rel="stylesheet" href="/assets/css/site.css">',
        "",
        "    <script>",
        "    window.dataLayer = window.dataLayer || [];",
        "    function gtag(){dataLayer.push(arguments);}",
        "    gtag('consent', 'default', {",
        "        ad_storage: 'denied',",
        "        ad_user_data: 'denied',",
        "        ad_personalization: 'denied',",
        "        analytics_storage: 'denied',",
        f"        region: [{CONSENT_REGIONS}],",
        "        wait_for_update: 500",
        "    });",
        "    gtag('consent', 'default', {",
        "        ad_storage: 'granted',",
        "        ad_user_data: 'granted',",
        "        ad_personalization: 'granted',",
        "        analytics_storage: 'granted'",
        "    });",
        "    </script>",
        '    <script defer src="/assets/scripts/consent.js"></script>',
        "",
        '    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6135599490918760" crossorigin="anonymous"></script>',
    ]
    if page.get("ads", True):
        lines.append('    <script async src="https://vitrine.setbox.com.br/t.js" data-site="pricetohours" data-label="Ads"></script>')
    lines += [
        "",
        '    <script async src="https://www.googletagmanager.com/gtag/js?id=G-QL6VNRM7T9"></script>',
        "    <script>",
        "    gtag('js', new Date());",
        "",
        "    gtag('config', 'G-QL6VNRM7T9');",
        "    </script>",
    ]
    for script in page.get("scripts", []):
        lines.append(f'    <script defer src="{script}"></script>')
    for data in page.get("schema", []):
        lines.append(jsonld(data))
    lines.append("</head>")
    return "\n".join(lines)


def header(active):
    links = []
    for url, label in NAV:
        current = ' aria-current="page"' if url == active else ""
        links.append(f'            <a href="{url}"{current}>{label}</a>')
    cta = "" if active == "/" else '\n        <a class="btn btn-peach" href="/#calculator">Open the calculator</a>'
    return (
        '<a class="skip-link" href="#main">Skip to content</a>\n'
        '<header class="site-header">\n'
        '    <div class="container">\n'
        '        <a class="brand" href="/"><img src="/assets/images/logo-stacked.svg" alt="Price to Hours" width="128" height="48"></a>\n'
        '        <nav class="nav" aria-label="Main">\n'
        + "\n".join(links)
        + "\n        </nav>"
        + cta
        + "\n    </div>\n</header>"
    )


def footer():
    return """<footer class="site-footer">
    <div class="container">
        <div class="footer-about">
            <span class="footer-brand">Price to Hours</span>
            <span>Made by <a href="/about/#author">Jackson Teixeira</a> at <a href="https://setbox.com.br">Setbox</a>, a software studio in Maringá, Brazil. Free to use, no sign-up. Not financial advice.</span>
        </div>
        <nav class="footer-nav" aria-label="Footer">
            <a href="/about/">About</a>
            <a href="/about/#method">How we calculate</a>
            <a href="/about/#contact">Contact</a>
            <a href="/about/#privacy">Privacy policy</a>
            <a href="/about/#terms">Terms of use</a>
            <button class="link-button" type="button" data-consent-settings>Privacy and cookie settings</button>
        </nav>
    </div>
</footer>"""


def page_html(page, body):
    return f"{head(page)}\n<body>\n\n{header(page['active'])}\n\n{body.strip()}\n\n{footer()}\n\n</body>\n</html>\n"


def write(path, content):
    target = ROOT / path.lstrip("/")
    if path.endswith("/"):
        target = target / "index.html"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content)


def week_grid(hours, hours_per_day=8, days_per_week=5):
    cells = []
    for row in range(hours_per_day):
        for column in range(days_per_week):
            fill = min(1, max(0, hours - (column * hours_per_day + row)))
            cells.append(f'<div class="cell"><div class="cell-fill" style="width: {round(fill * 100)}%"></div></div>')
    names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][:days_per_week]
    cells += [f'<span class="day-name">{name}</span>' for name in names]
    return "".join(cells)


def cost_table(items):
    head_cells = "".join(f'<th scope="col">At ${w} an hour</th>' for w in TABLE_WAGES)
    rows = [
        f'<tr><th scope="row">A $5 coffee <span class="muted">(example)</span></th>'
        + "".join(f"<td>{hours_short(5 / w)}</td>" for w in TABLE_WAGES)
        + "</tr>"
    ]
    for item in sorted(items, key=lambda i: i["price"]):
        cells = "".join(f"<td>{hours_short(item['price'] / w)}</td>" for w in TABLE_WAGES)
        rows.append(f'<tr><th scope="row"><a href="/cost/{item["slug"]}/">{esc(cap(item["name"]))}</a> <span class="muted">{item["price_label"]}</span></th>{cells}</tr>')
    return (
        '<div class="card table-wrap"><table class="cost-table">'
        f"<caption>US list prices checked on {TODAY_LABEL}, divided by hourly pay before taxes. The coffee is an example price.</caption>"
        f'<thead><tr><th scope="col">Item</th>{head_cells}</tr></thead>'
        f"<tbody>{''.join(rows)}</tbody></table></div>"
    )


def item_page(item, items):
    path = f"/cost/{item['slug']}/"
    at20 = item["price"] / 20
    days20 = at20 / 8
    figure, unit = hours_parts(at20)
    title_name = cap(item["name"])
    h1 = f"How many hours of work is {item['phrase']}?"
    description = f"{title_name} costs {item['price_label']}: {figure} {unit} of work at $20 an hour and {hours_short(item['price'] / 7.25)} at the US federal minimum wage. See six wages and try your own."
    top = max(item["price"] / w for w in LADDER)
    rows = []
    for wage in LADDER:
        hours = item["price"] / wage
        highlight = " bar-row-highlight" if wage == 20 else ""
        rows.append(
            f'<div class="bar-row{highlight}" role="row"><span role="rowheader">{money(wage)} an hour</span>'
            f'<span class="bar-track" role="cell"><span class="bar-fill" style="width: {round(hours / top * 100, 1)}%"></span></span>'
            f'<span class="bar-value" role="cell">{hours_short(hours)}, {number(hours / 8)} days</span></div>'
        )
    others = []
    for other in items:
        if other["slug"] == item["slug"]:
            continue
        name = cap(other["name"])
        others.append(f'<a class="other-link" href="/cost/{other["slug"]}/"><strong>{esc(name)}</strong><span>{hours_short(other["price"] / 20)} at $20 an hour</span></a>')
    before = "".join(f"<p>{esc(p)}</p>" for p in item["before"])
    crumbs = [("Home", "/"), ("What things cost", "/cost/"), (title_name, path)]
    body = f"""<main id="main">
    <section class="hero page-hero">
        <div class="container">
            {breadcrumb_nav(crumbs)}
            <h1 class="hero-title">{esc(h1)}</h1>
            <p class="hero-lead">At $20 an hour before taxes, {esc(item['phrase'])} costs <b>{figure} {unit} of work</b>, or {number(days20)} workdays of 8 hours. Price: {item['price_label']}.</p>
        </div>
    </section>

    <section class="band">
        <div class="container section section-stack">
            <h2 class="section-title">Hours by hourly pay</h2>
            <div class="bars" role="table" aria-label="Hours of work for {esc(item['phrase'])} by hourly pay">
                {''.join(rows)}
            </div>
            <p class="note">Days assume 8 working hours. $7.25 is the <a href="https://www.dol.gov/agencies/whd/minimum-wage">US federal minimum wage</a>. Pay is before taxes, so the real time cost is higher: see <a href="/guides/discretionary-hourly-rate/">your discretionary hourly rate</a>.</p>
        </div>
    </section>

    <div class="container">
        <section class="section split">
            <form class="card card-raised try-form" id="item-calculator" data-price="{item['price']}">
                <h2>Try it with your pay</h2>
                <div class="field field-plain">
                    <label for="item-wage">Your hourly pay, in dollars</label>
                    <input id="item-wage" type="number" inputmode="decimal" min="0" step="any" value="20">
                </div>
                <p class="try-result" aria-live="polite">{esc(title_name)} would cost you <strong>{figure} {unit}</strong> of work.</p>
                <a href="/?p={item['price']}&amp;w=20" data-item-link>Open the full calculator with this price</a>
            </form>
            <div class="split-main prose">
                <p>{esc(item['intro'])}</p>
                <h2 class="section-title">{esc(item['before_title'])}</h2>
                {before}
                <p class="note">Price: {item['price_label']}. {esc(item['price_note'])} Source: <a href="{item['source_url']}">{esc(item['source_name'])}</a>, checked {TODAY_LABEL}. Prices outside the US differ: use the <a href="/">calculator</a> with your local price and currency.</p>
            </div>
        </section>

        <section class="section section-stack">
            <div class="ad-container"><div class="vitrine-faixa" data-vitrine-slot="faixa"></div></div>
            <h2 class="section-title">Other things, at $20 an hour</h2>
            <div class="others">{''.join(others)}</div>
        </section>
    </div>
</main>"""
    page = {
        "path": path,
        "active": "/cost/",
        "title": f"{title_name} in Hours of Work: {figure} {unit.capitalize()} at $20/h | Price to Hours",
        "og_title": h1,
        "description": description,
        "og": f"cost-{item['slug']}",
        "og_alt": f"{title_name} = {figure} {unit} of work at $20 an hour",
        "h1": h1,
        "article": True,
        "scripts": ["/assets/scripts/item.js"],
    }
    page["schema"] = [article_schema(page, description), breadcrumb_schema(crumbs)]
    return page, body


def wage_page(entry, items):
    wage = entry["wage"]
    path = f"/salary/{wage}-an-hour/"
    yearly = wage * 2080
    h1 = f"${wage} an hour is how much a year?"
    description = f"${wage} an hour is {money(yearly)} a year before taxes at 40 hours a week, {money(round(yearly / 12, 2))} a month and {money(wage * 40)} a week. Full breakdown and what it buys in hours."
    table_rows = [
        ("Year", 2080), ("Month", 2080 / 12), ("Two weeks", 80), ("Week", 40), ("Day (8 hours)", 8),
    ]
    full = "".join(f"<tr><th scope=\"row\">{label}</th><td>{money(round(wage * hrs, 2))}</td><td>{money(round(wage * hrs * 30 / 40, 2))}</td></tr>" for label, hrs in table_rows)
    buys = "".join(
        f'<li><a href="/cost/{i["slug"]}/">{esc(cap(i["name"]))}</a>: {hours_short(i["price"] / wage)} of work</li>'
        for i in sorted(items, key=lambda x: x["price"])
    )
    others = " ".join(f'<a href="/salary/{w}-an-hour/">${w}</a>' for w in [15, 20, 25, 30, 40, 50] if w != wage)
    crumbs = [("Home", "/"), ("Salary", "/salary/"), (f"${wage} an hour", path)]
    body = f"""<main id="main">
    <section class="hero page-hero">
        <div class="container">
            {breadcrumb_nav(crumbs)}
            <h1 class="hero-title">{esc(h1)}</h1>
            <p class="hero-lead">At 40 hours a week and 52 weeks a year, ${wage} an hour is <b>{money(yearly)} a year</b> before taxes. That is {money(round(yearly / 12, 2))} a month and {money(wage * 40)} a week.</p>
        </div>
    </section>

    <section class="band">
        <div class="container section section-stack">
            <h2 class="section-title">${wage} an hour by period</h2>
            <div class="card table-wrap">
                <table class="cost-table">
                    <caption>Before taxes. Full time is 40 hours a week, part time 30 hours. A year is 52 weeks, or 2,080 hours at full time.</caption>
                    <thead><tr><th scope="col">Period</th><th scope="col">Full time</th><th scope="col">Part time (30 h)</th></tr></thead>
                    <tbody>{full}</tbody>
                </table>
            </div>
        </div>
    </section>

    <div class="container">
        <section class="section split">
            <div class="split-main prose">
                <h2 class="section-title">What ${wage} an hour means</h2>
                <p>{esc(entry['note'])}</p>
                <p>These numbers are gross pay. Federal and state income tax, Social Security and Medicare come out before the money reaches you, and how much depends on where you live and your situation. <a href="/guides/gross-vs-net-pay/">Gross or net: which pay to use</a> explains which number to use when you compare prices.</p>
                <p>Paid time off changes the math too. If your 2,080 hours include paid holidays and vacation, the yearly figure above is what you earn. If you are paid only for hours worked, subtract the weeks you take off.</p>
                <h2 class="section-title">What ${wage} an hour buys, in hours</h2>
                <ul class="plain-list">{buys}</ul>
                <div class="ad-container"><div class="vitrine-artigo" data-vitrine-slot="artigo"></div></div>
                <p>Other wages: {others}. Or use the <a href="/salary/">hourly to salary calculator</a> with your own hours.</p>
            </div>
            <aside class="split-side">
                <a class="card card-raised highlight-card" href="/?w={wage}"><strong>{money(yearly)}</strong><span>a year at ${wage} an hour. See what your next purchase costs in hours of this pay.</span></a>
            </aside>
        </section>
    </div>
</main>"""
    page = {
        "path": path,
        "active": "/salary/",
        "title": f"${wage} an Hour Is How Much a Year? {money(yearly)} | Price to Hours",
        "og_title": h1,
        "description": description,
        "og": f"salary-{wage}",
        "og_alt": f"${wage} an hour = {money(yearly)} a year before taxes",
        "h1": h1,
        "article": True,
    }
    page["schema"] = [article_schema(page, description), breadcrumb_schema(crumbs)]
    return page, body


GUIDES = [
    ("discretionary-hourly-rate", "Your discretionary hourly rate", "Why a $20 item can cost you two hours when you earn $20 an hour."),
    ("gross-vs-net-pay", "Gross or net: which pay to use", "Which hourly number to use when you turn prices into hours."),
    ("buying-on-credit", "Buying on credit spends future hours", "What interest does to the hours a purchase costs."),
    ("rent-in-hours", "How many hours of work does your rent cost?", "Turn rent into hours and check it against the 30% guideline."),
    ("true-cost-of-a-car", "The true cost of a car, in hours", "Payment, insurance, fuel and repairs, added up in hours of work."),
]


def guides_hub():
    cards = "".join(
        f'<a class="card guide-card" href="/guides/{slug}/"><strong>{esc(title)}</strong><span>{esc(blurb)}</span></a>'
        for slug, title, blurb in GUIDES
    )
    crumbs = [("Home", "/"), ("Guides", "/guides/")]
    body = f"""<main id="main" class="container section section-stack">
    {breadcrumb_nav(crumbs)}
    <h1 class="article-title">Guides</h1>
    <p class="prose">Short guides on turning money into time: which pay to use, what your free hours are worth, and what rent, cars and credit really cost in hours of work.</p>
    <div class="hub-grid">{cards}</div>
</main>"""
    page = {
        "path": "/guides/", "active": "/guides/", "title": "Guides: Money in Hours of Work | Price to Hours",
        "description": "Guides on turning prices into hours of work: discretionary hourly rate, gross vs net pay, credit, rent and the true cost of a car.",
        "og": "guides", "og_alt": "Price to Hours guides", "ads": False,
        "schema": [breadcrumb_schema(crumbs)],
    }
    return page, body


def cost_hub(items):
    cards = "".join(
        f'<a class="card guide-card" href="/cost/{i["slug"]}/"><strong>{esc(cap(i["name"]))}</strong><span>{i["price_label"]}: {hours_short(i["price"] / 20)} at $20 an hour, {hours_short(i["price"] / 7.25)} at minimum wage.</span></a>'
        for i in sorted(items, key=lambda x: x["price"])
    )
    crumbs = [("Home", "/"), ("What things cost", "/cost/")]
    body = f"""<main id="main" class="container section section-stack">
    {breadcrumb_nav(crumbs)}
    <h1 class="article-title">What things cost, in hours of work</h1>
    <p class="prose">Popular purchases converted into hours of work at six hourly wages, with the current US price and its source. Prices were checked on {TODAY_LABEL}.</p>
    {cost_table(items)}
    <div class="hub-grid">{cards}</div>
    <p class="note">Missing something? Type any price into the <a href="/">calculator</a>.</p>
</main>"""
    page = {
        "path": "/cost/", "active": "/cost/", "title": "What Things Cost in Hours of Work | Price to Hours",
        "description": f"Consoles, phones, laptops and subscriptions converted into hours of work at $7.25 to $50 an hour, with US prices checked {TODAY_LABEL}.",
        "og": "cost", "og_alt": "What things cost in hours of work", "ads": False,
        "schema": [breadcrumb_schema(crumbs)],
    }
    return page, body


def content_page(name, meta, replacements):
    body = (SRC / "pages" / f"{name}.html").read_text()
    for key, value in replacements.items():
        body = body.replace(f"@@{key}@@", value)
    if "@@READ_TIME@@" in body:
        body = body.replace("@@READ_TIME@@", f"{read_time(body)} minute read")
    if meta.get("crumbs"):
        body = body.replace("@@BREADCRUMB@@", breadcrumb_nav(meta["crumbs"]))
        meta.setdefault("schema", []).append(breadcrumb_schema(meta["crumbs"]))
    if meta.get("article"):
        meta["schema"].insert(0, article_schema(meta, meta["description"]))
    return meta, body


def main():
    items = load("items.json")
    wages = load("wages.json")
    pages = []

    wage_links = "".join(f'<a class="card guide-card" href="/salary/{w["wage"]}-an-hour/"><strong>${w["wage"]} an hour</strong><span>{money(w["wage"] * 2080)} a year</span></a>' for w in wages)
    guide_cards = "".join(f'<a class="card guide-card" href="/guides/{slug}/"><strong>{esc(title)}</strong><span>{esc(blurb)}</span></a>' for slug, title, blurb in GUIDES[:3])
    replacements = {
        "COST_TABLE": cost_table(items),
        "WEEK_GRID": week_grid(25),
        "WAGE_LINKS": wage_links,
        "GUIDE_CARDS": guide_cards,
        "TODAY_LABEL": TODAY_LABEL,
    }

    home_description = "Free price to hours calculator: turn any price into the hours, workdays and weeks of work it costs you, with a true-cost mode that counts only money left after bills."
    pages.append(content_page("home", {
        "path": "/", "active": "/", "title": "Price to Hours Calculator: How Many Hours of Work Does It Cost?",
        "og_title": "How many hours of your work does it cost?", "description": home_description,
        "og": "home", "og_alt": "Any price in hours, workdays and weeks of your work",
        "scripts": ["/assets/scripts/calculator.js"],
        "schema": [
            {"@context": "https://schema.org", "@type": "WebSite", "name": SITE_NAME, "url": f"{SITE}/"},
            {"@context": "https://schema.org", **ORGANIZATION, "contactPoint": {"@type": "ContactPoint", "email": "contato@setbox.com.br", "contactType": "customer support"}},
            {"@context": "https://schema.org", "@type": "WebApplication", "name": "Price to Hours Calculator", "url": f"{SITE}/", "applicationCategory": "FinanceApplication", "operatingSystem": "Any", "description": home_description, "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}},
        ],
    }, replacements))

    salary_description = "Free hourly to salary calculator: turn an hourly wage into yearly, monthly and weekly pay, or a salary into an hourly rate. Includes US, UK, Canada and Australia minimum wages."
    pages.append(content_page("salary", {
        "path": "/salary/", "active": "/salary/", "title": "Hourly to Salary Calculator: Hourly Wage to Yearly Pay | Price to Hours",
        "og_title": "Hourly to salary calculator", "description": salary_description,
        "og": "salary", "og_alt": "Hourly to salary calculator",
        "scripts": ["/assets/scripts/salary.js"],
        "crumbs": [("Home", "/"), ("Salary", "/salary/")],
        "schema": [{"@context": "https://schema.org", "@type": "WebApplication", "name": "Hourly to Salary Calculator", "url": f"{SITE}/salary/", "applicationCategory": "FinanceApplication", "operatingSystem": "Any", "description": salary_description, "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}}],
    }, replacements))

    guide_meta = {
        "discretionary-hourly-rate": ("Discretionary Hourly Rate: What Your Time Is Really Worth", "Your pay is not what you get to spend. Find your discretionary hourly rate, the money left after bills per hour worked, with a worked example.", "Your discretionary hourly rate: what your time is really worth when you shop"),
        "gross-vs-net-pay": ("Gross or Net Pay: Which to Use for Prices in Hours", "Gross pay, take-home pay or free money after bills? Which hourly number to use when you turn a price into hours of work, with examples.", "Gross or net: which pay to use when you count prices in hours"),
        "buying-on-credit": ("Buying on Credit: How Interest Adds Hours of Work", "A $1,000 purchase paid over a year at 24% APR costs about $1,135. See how interest turns into extra hours of work, with the math.", "Buying on credit spends future hours"),
        "rent-in-hours": ("How Many Hours of Work Does Your Rent Cost?", "Turn your rent into hours of work and check it against the 30% of income guideline that HUD uses to measure housing cost burden.", "How many hours of work does your rent cost?"),
        "true-cost-of-a-car": ("The True Cost of a Car in Hours of Work", "A car costs more than its payment. Add insurance, fuel, maintenance and depreciation, then turn the monthly total into hours of work.", "The true cost of a car, in hours of work"),
    }
    for slug, (title, description, h1) in guide_meta.items():
        crumbs = [("Home", "/"), ("Guides", "/guides/"), (h1, f"/guides/{slug}/")]
        pages.append(content_page(f"guide-{slug}", {
            "path": f"/guides/{slug}/", "active": "/guides/", "title": f"{title} | Price to Hours",
            "og_title": h1, "description": description, "og": f"guide-{slug}", "og_alt": h1, "h1": h1,
            "article": True, "crumbs": crumbs, "schema": [],
        }, replacements))

    pages.append(content_page("about", {
        "path": "/about/", "active": "/about/", "title": "About, Methodology, Contact and Privacy | Price to Hours",
        "description": "Who makes Price to Hours, how the calculations work, how to reach us, and how the site handles data, cookies and advertising.",
        "og": "home", "og_alt": "About Price to Hours", "ads": False,
        "crumbs": [("Home", "/"), ("About", "/about/")],
        "schema": [{"@context": "https://schema.org", **AUTHOR, "worksFor": ORGANIZATION}],
    }, replacements))

    pages.append(guides_hub())
    pages.append(cost_hub(items))
    for item in items:
        pages.append(item_page(item, items))
    for entry in wages:
        pages.append(wage_page(entry, items))

    for page, body in pages:
        write(page["path"], page_html(page, body))

    not_found = (SRC / "pages" / "404.html").read_text()
    write("/404.html", page_html({
        "path": "/404.html", "active": "", "title": "Page not found | Price to Hours",
        "description": "This page does not exist. Try the price to hours calculator or browse what things cost in hours of work.",
        "og": "home", "og_alt": "Price to Hours", "ads": False,
    }, not_found).replace('<link rel="canonical" href="https://pricetohours.com/404.html">', '<meta name="robots" content="noindex">'))

    urls = "".join(f"  <url><loc>{SITE}{p['path']}</loc><lastmod>{p.get('modified', TODAY)}</lastmod></url>\n" for p, _ in pages)
    (ROOT / "sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n')

    manifest = [{"path": p["path"], "og": p["og"], "title": p.get("og_title", p["title"]), "alt": p["og_alt"]} for p, _ in pages]
    (SRC / "og-pages.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(f"{len(pages) + 1} pages")


if __name__ == "__main__":
    main()
