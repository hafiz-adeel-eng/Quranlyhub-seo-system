# Hobart Appliance Care — SEO & Content

This repo is the SEO toolkit for **hobartappliancecare.com**, a local appliance
repair business in Hobart, Tasmania, Australia (fridges/refrigerators, washing
machines, dryers, ovens, dishwashers, vacuum cleaners). Most day-to-day work
happens directly on the live WordPress site via the `novamira-hobartappliancec`
MCP connector, not in this repo's Python code (that's a separate GA4/GSC
reporting toolkit — see README.md).

## Content-writing SOP — always follow this for any new article or page

Role to hold: a senior Local SEO strategist and expert appliance-repair
content planner, writing for real Hobart homeowners — not an SEO writer, not
an AI.

**Before writing anything new:**

1. Audit the existing site first. Pull every published post/page's title,
   focus keyword, search intent, word count and internal links (via
   `rank-math/get-seo-scores`, `rank-math/get-post-seo-meta`, or
   `novamira/execute-php` with `get_posts()` — see "Site facts" below for
   what already exists). Read this list before proposing a topic.
2. Never propose a topic that substantially overlaps an existing page's
   search intent. A new angle on the same appliance is fine (e.g. "not
   cooling" vs "making noise" vs "leaking") — a near-duplicate of an
   existing angle is not.
3. Prioritize realistic local + long-tail keyword opportunities over vanity
   generic ones.
4. Where possible, check what's currently ranking for the target keyword
   (WebSearch) to find genuine content gaps — not to copy it.
5. Identify gaps: missing subtopics, unanswered customer questions, weak
   competitor sections, a genuinely better answer we can give.
6. Transactional intent first (service pages), supported by informational
   content (blog posts) that link back to the matching service page.
7. Cover appliances/problems/entities/local context naturally. Never keyword
   stuff, never force "Hobart"/"Tasmania" repeatedly.
8. Write for humans first; structure for both classic Google results and
   AI/answer-engine surfaces — a direct "Quick answer" up top, clear
   H2/H3s, an FAQ block.
9. Recommend natural internal links (service ↔ blog, blog ↔ blog) with
   descriptive anchor text — not "click here".
10. Tone: a real technician explaining the problem and fix to a homeowner —
    practical, honest, no filler, no hype.
11. Every factual claim must be real. Never invent statistics, testimonials,
    certifications, prices, guarantees, experience, or technical claims —
    only use what's already established on the site (list below) or
    generally-true appliance knowledge.

**When proposing content, output this structure:**
recommended title · primary keyword · secondary/long-tail keywords · search
intent · target audience · main entities/topics to cover · competitor
content gaps found · recommended H1/H2/H3 structure · internal-link
opportunities · suggested word count · unique value vs competitors · brief
writing direction.

**Never:** copy/paraphrase competitor content · keyword-stuff · write
generic AI filler · duplicate an existing topic without a real intent
difference · create doorway/location-spam pages (a city landing page needs
an actual service partner there first, not just a page) · invent local
facts or business claims · overuse "Hobart"/"Tasmania" unnaturally ·
sacrifice readability for SEO.

## Site technical facts (reuse these — don't re-derive each session)

- **Stack**: WordPress + Elementor (service pages, homepage, contact,
  book-online) + a custom lightweight blog system for `/blog/` and single
  posts (`wp-content/novamira-sandbox/hac-blog.php` — not Elementor,
  plain HTML in `post_content`).
- **SEO plugin**: Rank Math. Google Search Console is already linked
  (`rank-math/get-top-keywords`). GA4 is **not** connected the same way —
  no ability exposes it; the user has separate GA4 login access.
- **Blog article template** (match this exactly for new posts): opening
  `<p><strong>Quick answer:</strong> ...</p>`, then numbered `<h2>` checks,
  an `<h2>When it's a job for a technician</h2>` linking to the matching
  service page, an optional `<blockquote>`, then
  `<h2>Frequently Asked Questions</h2>` with `<h3>` Q + `<p>` A pairs, then
  a closing paragraph linking `/book-online/` and one related post.
- **Schema is automatic** — set the `hac_faq` post meta to a PHP array of
  `['q'=>..., 'a'=>...]` pairs matching the on-page FAQ, and
  `hac-blog.php`'s `wp_head` hook emits Article + BreadcrumbList + FAQPage
  JSON-LD for you. No manual schema needed.
- **Rank Math meta per post**: `rank_math_title` (keep **≤60 chars** — blog
  post titles do not need the "| Hobart Appliance Care" suffix, service
  pages do), `rank_math_description` (**≤160 chars**),
  `rank_math_focus_keyword` (must appear in the actual `post_title`, not
  just the SEO title).
- **Blog category**: id `3` ("Appliance Repair Tips") — used for all
  troubleshooting posts so far.
- **Write access**: `hostinger-ai-assistant/*` REST routes (posts/pages
  create, update, search) are OAuth-blocked for this connector (403).
  **Use `novamira/execute-php`** instead — `wp_insert_post()`,
  `wp_update_post()`, `update_post_meta()`, `set_post_thumbnail()` — for
  every content write. Elementor **reads** (`elementor-find-widgets`,
  `elementor-list-pages`) work fine via `hostinger-ai-assistant`; Elementor
  **writes** should go through `novamira/execute-php` editing
  `_elementor_data` JSON directly (see git history in this session for the
  pattern used to fix missing image alt text and enrich intro paragraphs).
- **Established true claims** (safe to reuse verbatim, never invent new
  ones beyond these): upfront flat-rate pricing / no hidden fees, 12-month
  parts & labour guarantee, flexible local scheduling, phone
  `(03) 6200 1234`, email `bookings@hobartappliancecare.com`, brands
  serviced vary by appliance page (Samsung, LG, Bosch, Fisher & Paykel,
  Miele, Westinghouse, Electrolux, Smeg, AEG, and others — check the
  specific service page's brand chips before citing one for that
  appliance). Never invent a price, a review count, a technician headcount,
  or a certification not already stated on the site.
- **Existing pages** (check before proposing a new one): Home, Fridge
  Repair Hobart, Washing Machine Repair Hobart, Oven Repairs Hobart,
  Dishwasher Repair Hobart, Dryer Repair Hobart, Vacuum Repairs Hobart,
  Contact Us, Book Online, Blog index — plus blog posts covering (per
  appliance) not-cooling/not-heating/not-spinning/leaking/making-noise/
  not-draining/losing-suction/not-drying, and one cross-cutting
  "Appliance Repair Cost in Hobart" guide that links every service page.
  Pull the live list with `rank-math/get-seo-scores` before planning new
  topics — it changes as new articles get published.
