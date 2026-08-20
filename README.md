# Appliance Repairs Tasmania — Website

A static, multi-page marketing website for a Hobart-based appliance repair
business, built to target Hobart & Greater Hobart, Tasmania. Design system
uses **orange** (primary) and **navy blue** (secondary) throughout, applied
consistently across buttons, icons, section backgrounds and accents.

## ⚠️ Before going live

This is a template built with placeholder business details. Replace these
before publishing:

- **Phone numbers** — `1300 XXX XXX` and `(03) 6XXX XXXX` in `build/data.py`
  (`BUSINESS["phone_display"]` / `phone_local_display`) are intentionally
  unfinished placeholders, not real numbers. Update them and change
  `phone_href` from `#contact` to a real `tel:` link once you have one.
- **Email address** — `info@appliancerepairstasmania.com.au` is a placeholder
  domain, not a live mailbox.
- **Contact form** — the form on `/contact.html` is front-end only (it shows
  a success message but does not send anywhere). Wire it up to a real
  backend such as Formspree, Netlify Forms, or your own endpoint.
- **Legal pages** — `/terms.html` and `/privacy.html` contain generic
  placeholder text and should be replaced with real, reviewed policies.
- **Social links** — Facebook/Instagram/Google links in `build/data.py`
  (`BUSINESS["socials"]`) are placeholders (`#`).
- **Domain** — `https://appliancerepairstasmania.com.au` is used for
  canonical/OG tags in `build/templates/base.html`; update to your real
  domain.

## Structure

This is a plain static site (no server/build step needed to host it) that is
*generated* from Jinja2 templates so every page shares one header, footer and
nav. Edit content in one place and regenerate:

```
build/
  data.py               # all site content: business info, services, FAQs,
                         # testimonials, suburbs, nav menus
  generate.py           # renders templates/ -> flat HTML files
  templates/
    base.html            # <head>, includes header/footer
    partials/
      header.html         # top bar + sticky nav + mega dropdown + mobile menu
      footer.html
      cta_banner.html
      icons.html          # inline SVG icon set (Jinja macro)
    index.html, about.html, services.html, service_areas.html,
    faq.html, contact.html, legal.html, service_detail.html

assets/
  css/style.css          # design system: colors, buttons, cards, nav, etc.
  js/main.js              # mobile nav, dropdown, FAQ accordion, form UX

index.html, about.html, services.html, service-areas.html, faq.html,
contact.html, terms.html, privacy.html, services/*.html   # generated output
```

### Regenerating pages

After editing anything in `build/data.py` or `build/templates/`, rebuild the
static HTML:

```bash
pip install jinja2   # first time only
python3 build/generate.py
```

This overwrites the generated `.html` files at the repo root and in
`/services/`. Never hand-edit those generated files directly — edit the
templates/data instead, or your changes will be lost on the next build.

### Previewing locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

## Pages included

- Home, About Us, Services (hub), Service Areas, FAQ, Contact
- Terms of Use, Privacy Policy (placeholders)
- 9 individual service pages: Refrigerator, Washing Machine, Clothes Dryer,
  Oven/Stove/Range, Dishwasher, Outdoor Kitchen & BBQ, Commercial Appliance
  Repair, Dryer Vent Cleaning, Appliance Wellness Program
- All 15 residential + commercial services are listed with descriptions on
  the Services hub page, even where they share a detail page (e.g. Freezer,
  Microwave, Range Hood, Ice Maker, Wine Cooler, Garbage Disposal, Trash
  Compactor route through `/services.html` cards).

## Service area

Content targets Hobart CBD and Greater Hobart suburbs (Sandy Bay, Glenorchy,
Kingston, Bellerive, Claremont, New Town, Moonah, etc.) — see
`build/data.py: SERVICE_AREAS` to adjust.
