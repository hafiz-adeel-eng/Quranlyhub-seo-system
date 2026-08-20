#!/usr/bin/env python3
"""Static site generator for Appliance Repairs Tasmania.

Renders Jinja2 templates in build/templates into flat, deployable HTML
files at the repo root (and /services). Run after editing build/data.py
or anything under build/templates:

    python3 build/generate.py
"""
import os
import sys

from jinja2 import Environment, FileSystemLoader, select_autoescape

sys.path.insert(0, os.path.dirname(__file__))
import data as d

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "templates")

env = Environment(
    loader=FileSystemLoader(TEMPLATES_DIR),
    autoescape=select_autoescape(["html"]),
    trim_blocks=True,
    lstrip_blocks=True,
)

BASE_CONTEXT = {
    "biz": d.BUSINESS,
    "nav_residential": d.NAV_RESIDENTIAL,
    "nav_commercial": d.NAV_COMMERCIAL,
    "nav_main": d.NAV_MAIN,
    "residential_services": d.RESIDENTIAL_SERVICES,
    "commercial_services": d.COMMERCIAL_SERVICES,
    "all_services": d.ALL_SERVICES_BY_SLUG,
    "featured_slugs": d.FEATURED_HOME_SLUGS,
    "why_us": d.WHY_US,
    "process_steps": d.PROCESS_STEPS,
    "testimonials": d.TESTIMONIALS,
    "faqs": d.FAQS,
    "service_areas": d.SERVICE_AREAS,
}


SITE_URL = "https://appliancerepairstasmania.com.au"
rendered_paths = []


def render(template_name, out_path, **extra_context):
    context = dict(BASE_CONTEXT)
    context["path"] = out_path
    context.update(extra_context)
    template = env.get_template(template_name)
    html = template.render(**context)
    full_path = os.path.join(ROOT, out_path.lstrip("/"))
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(html)
    rendered_paths.append(out_path)
    print(f"  wrote {out_path}")


def write_sitemap():
    urls = "\n".join(
        f"  <url><loc>{SITE_URL}{p}</loc></url>" for p in rendered_paths
    )
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{urls}\n"
        "</urlset>\n"
    )
    with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write(xml)
    print("  wrote /sitemap.xml")


def main():
    print("Generating Appliance Repairs Tasmania site...")

    render(
        "index.html", "/index.html",
        title=f"{d.BUSINESS['name']} | Local Appliance Repair in Hobart, TAS",
        description="Fast, reliable appliance repair in Hobart & Greater Hobart. Fridges, washers, dryers, ovens, dishwashers & more. Upfront pricing, qualified local technicians.",
    )

    render(
        "about.html", "/about.html",
        title=f"About Us | {d.BUSINESS['name']}",
        description="Meet Hobart's local appliance repair team. Qualified technicians, upfront pricing, and a workmanship guarantee on every job.",
    )

    render(
        "services.html", "/services.html",
        title=f"All Appliance Repair Services | {d.BUSINESS['name']}",
        description="Browse every residential and commercial appliance repair service we offer across Hobart — fridges, ovens, washers, dryers, dishwashers, outdoor kitchens and more.",
    )

    render(
        "service_areas.html", "/service-areas.html",
        title=f"Service Areas | {d.BUSINESS['name']}",
        description="See every Hobart and Greater Hobart suburb we service, from the CBD to Kingston, Glenorchy, Bellerive and beyond.",
    )

    render(
        "faq.html", "/faq.html",
        title=f"Frequently Asked Questions | {d.BUSINESS['name']}",
        description="Answers to common questions about booking, pricing, brands serviced and warranty on appliance repairs in Hobart.",
    )

    render(
        "contact.html", "/contact.html",
        title=f"Contact & Book a Repair | {d.BUSINESS['name']}",
        description="Book your appliance repair online or contact our Hobart team directly. Fast response, upfront pricing, scheduled appointments.",
    )

    render(
        "legal.html", "/terms.html",
        title=f"Terms of Use | {d.BUSINESS['name']}",
        description="Terms of use for the Appliance Repairs Tasmania website.",
        page_heading="Terms of Use",
        page_kind="terms",
    )

    render(
        "legal.html", "/privacy.html",
        title=f"Privacy Policy | {d.BUSINESS['name']}",
        description="Privacy policy for Appliance Repairs Tasmania.",
        page_heading="Privacy Policy",
        page_kind="privacy",
    )

    for s in d.SERVICE_DETAILS:
        related = [r for r in d.RESIDENTIAL_SERVICES if r["slug"] != s["slug"]][:4]
        render(
            "service_detail.html", f"/services/{s['slug']}.html",
            title=f"{s['title']} Hobart | {d.BUSINESS['name']}",
            description=s["meta"],
            service=s,
            related_services=related,
        )

    write_sitemap()
    print("Done.")


if __name__ == "__main__":
    main()
