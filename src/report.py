import csv
import os
from urllib.parse import urlparse


def _path_only(url):
    return urlparse(url).path or "/"


def quick_win_pages(gsc_pages, position_min=5, position_max=20, min_impressions=20):
    """Pages ranking just outside/around page 1 with real search volume -
    the best ROI targets for on-page SEO improvements."""
    candidates = [
        p
        for p in gsc_pages
        if position_min <= p["position"] <= position_max and p["impressions"] >= min_impressions
    ]
    return sorted(candidates, key=lambda p: p["impressions"], reverse=True)


def low_ctr_pages(gsc_pages, position_max=10, ctr_max=0.02, min_impressions=50):
    """Pages already ranking well but with a weak click-through rate -
    usually a title/meta description problem, not a ranking problem."""
    candidates = [
        p
        for p in gsc_pages
        if p["position"] <= position_max and p["ctr"] <= ctr_max and p["impressions"] >= min_impressions
    ]
    return sorted(candidates, key=lambda p: p["impressions"], reverse=True)


def top_queries_no_page1(gsc_queries, min_impressions=30, position_min=11):
    """Queries with real demand where the site isn't on page 1 yet."""
    candidates = [
        q for q in gsc_queries if q["impressions"] >= min_impressions and q["position"] >= position_min
    ]
    return sorted(candidates, key=lambda q: q["impressions"], reverse=True)


def merge_traffic(gsc_pages, ga4_rows):
    """Join GSC search performance with GA4 on-site engagement per page path."""
    ga4_by_path = {_path_only(r["landing_page"]): r for r in ga4_rows}
    merged = []
    for p in gsc_pages:
        path = _path_only(p["page"])
        ga4 = ga4_by_path.get(path, {})
        merged.append(
            {
                **p,
                "sessions": ga4.get("sessions", 0),
                "bounce_rate": ga4.get("bounce_rate", 0.0),
            }
        )
    return merged


def write_csv(rows, filepath):
    if not rows:
        return
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)
