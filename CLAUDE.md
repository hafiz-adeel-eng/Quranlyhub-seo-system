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
  appliance). The business now has its own dedicated local team in each of
  Launceston, Devonport, Burnie and Ulverstone (confirmed directly by the
  owner 2026-08-31) — city landing pages should say "our local
  [City] team", not frame technicians as travelling out from Hobart. Never
  invent a price, a review count, a technician headcount, or a
  certification not already stated on the site.
- **Existing pages** (check before proposing a new one): Home (Hobart),
  Fridge Repair Hobart, Washing Machine Repair Hobart, Oven Repairs Hobart,
  Dishwasher Repair Hobart, Dryer Repair Hobart, Vacuum Repairs Hobart,
  Contact Us, Book Online, Blog index, plus dedicated city landing pages —
  Appliance Repair Launceston, Appliance Repair Devonport, Appliance Repair
  Burnie, Appliance Repair Ulverstone (each with its own unique intro/copy,
  not cloned Hobart text — cross-linked to each other and to Hobart) —
  plus blog posts covering (per appliance)
  not-cooling/not-heating/not-spinning/leaking/making-noise/not-draining/
  not-defrosting/losing-suction/not-drying/won't-start/stopping-mid-cycle/
  shutting-off, one cross-cutting "Appliance Repair Cost in Hobart" guide
  that links every service page, and an "Appliance Rental vs Repair"
  guide. Pull the live list with `rank-math/get-seo-scores` before
  planning new topics — it changes as new articles get published.
- **Caching — 3 layers, all must be cleared after any content edit**:
  (1) LiteSpeed Cache (server page cache) and Hostinger's edge CDN (`hcdn`)
  — both cleared together by
  `wp_get_ability('hostinger-ai-assistant/litespeed-cache-flush')->execute([])`
  (plain `do_action('litespeed_purge_all')` does NOT reach the hcdn edge).
  (2) A persistent external object cache is active
  (`wp_using_ext_object_cache()` returns true) — `update_post_meta()` on
  `_elementor_data` can still be served stale to live requests until you
  also call `wp_cache_flush()`. (3) Elementor caches its own rendered
  output per-page in postmeta key `_elementor_element_cache` (separate
  from `_elementor_data` and from `_elementor_css`) — a direct
  `update_post_meta(..., '_elementor_data', ...)` edit does NOT invalidate
  it, so the page can keep rendering the pre-edit version indefinitely
  until that key is cleared: `delete_post_meta($post_id,
  '_elementor_element_cache')`.
  **After any `_elementor_data` edit, always run all three**: delete
  `_elementor_element_cache` for every edited post → `wp_cache_flush()` →
  the `litespeed-cache-flush` ability. Then verify with a fresh
  `wp_remote_get()` on the live URL and confirm the actual new text/markup
  is present in the body — a `MISS` cache header alone is not proof; it
  only shows *a* cache layer was bypassed, not that the rendered content
  is current.
  **A 4th layer specifically for XML sitemaps**: Rank Math caches its own
  generated sitemap output (as a physical file under
  `wp-content/uploads/rank-math/`, or a `_transient_sitemap_*` transient if
  the filesystem isn't writable) for up to 100 days, independent of
  everything above — the cache filename doesn't contain the word "sitemap"
  so a naive file search for it will miss it. Editing categories, terms,
  or Rank Math sitemap settings does NOT auto-invalidate this. After any
  such change, always call `\RankMath\Sitemap\Cache::invalidate_storage()`
  directly, then re-verify with a fresh `wp_remote_get()` on the actual
  `*-sitemap.xml` URL (not just the DB option value).
- **`hostinger-ai-assistant` plugin is not always active** — it was active
  on quranlyhub.com (so
  `wp_get_ability('hostinger-ai-assistant/litespeed-cache-flush')` works
  there) but got deactivated at some point on hobartappliancecare.com. Check
  `get_option('active_plugins')` first; when the ability isn't registered,
  fall back to `\LiteSpeed\Purge::purge_all()` directly (same effect, no
  ability wrapper needed) plus `wp_cache_flush()`.
- **Rank Math boolean options are strictly typed** — some settings (e.g.
  `titles.disable_author_archives`) are checked with `=== true` in Rank
  Math's own code, not a truthy check. Writing the string `'1'` or `'on'`
  silently does nothing (`'1' === true` is `false` in PHP). Set the real
  PHP boolean `true`/`false` for these; array-based settings still use
  `'on'`/`'off'` strings as normal (e.g. `sitemap.authors_sitemap`). When
  a setting change doesn't seem to take effect after a full cache purge,
  check the plugin's own source for the exact comparison it does before
  assuming it's a caching issue.
- **quranlyhub.com** (separate site, `novamira-quranlyhub-com` MCP
  connector): an online Quran-learning academy (Tafseer, Tajweed, Hifz,
  Quranic Arabic, Noorani Qaida, Alim/Aalimah courses) targeting Qatar,
  Canada, Saudi Arabia, UAE, USA, UK and Australia via `/locations/{country}/`
  pages. Also on Rank Math + LiteSpeed Cache. Single WP user
  (`quranlyhub`) — author archives are fully disabled site-wide
  (`titles.disable_author_archives = true`) since a single-author archive
  is pure duplicate content of the blog index.
  **Content conventions on this site** (confirmed 2026-09-07, plain
  `post_type = post` with raw HTML in `post_content`, no Elementor for
  blog articles): Article/BlogPosting schema is automatic (Rank Math's
  `pt_post_default_rich_snippet = article` outputs a `@graph` with
  WebSite/BreadcrumbList/WebPage/Person/BlogPosting in `<head>` on every
  post — never hand-code this). **FAQPage schema is NOT automatic** —
  write a real, visible "Frequently Asked Questions" H2 section (H3
  question + `<p>` answer, matching every question to an actual heading in
  the article) and append a matching
  `<script type="application/ld+json">{"@type":"FAQPage",...}</script>`
  block directly in `post_content`, verified to render live. `rank_math_focus_keyword`
  on this site holds a comma-separated primary+secondary keyword list (not
  a single strict-match keyword like Hobart). **Always resolve internal
  link URLs with `get_permalink($id)`** before writing an anchor — this
  site's slugs are frequently much shorter than the post title would
  suggest (e.g. post 634 "Online Quran Classes for Teenagers: What
  Actually Works at This Age" → `/online-quran-classes-for-teenagers/`),
  so a guessed slug reliably 404s. Categories in use: Learn Quran, Tajweed,
  Noorani Qaida, Hifz & Memorization, Quranic Arabic, Female Teachers,
  Quran Learning Tips, Tafseer, Parenting & Family (added 2026-09-07).
- **LiteSpeed "Guest Mode" breaks inline `<script>` click handlers unless
  excluded**: `optm-guest_only`/`guest_optm` are both `1` on this site,
  which forces `LITESPEED_GUEST_OPTM` and hard-codes JS Delay to max for
  every anonymous visitor — this **overrides** the `optm-js_defer`,
  `optm-js_defer_exc` and `optm-js_delay_inc` settings entirely (checked
  `wp-content/plugins/litespeed-cache/src/optimize.cls.php`), rewriting
  any inline `<script>` to `type="litespeed/javascript"` so it only runs
  after LiteSpeed's own delayed-JS loader activates on a later user
  interaction. On a *fresh page load* this can eat the very first click
  (e.g. the mobile hamburger button not opening the menu on the first
  tap). The only reliable per-script bypass is the `data-no-defer="1"`
  attribute (`data-no-optimize="1"` is a *different* attribute — it
  exempts a script from Combine/Minify only, not from Delay). Any inline
  `<script>` powering a critical, must-work-on-first-interaction control
  (nav toggles, the booking wizard, etc.) needs
  `<script data-no-optimize="1" data-no-defer="1">` — verify by fetching
  the live URL and confirming the script tag has **no**
  `type="litespeed/javascript"` wrapper.

## Content backups — `backups/` directory

Full exports of both sites' published posts/pages (post_content,
`_elementor_data`, and Rank Math meta) are periodically saved to
`backups/<site>_<date>.json` and committed to this repo — a real,
independent recovery point in case a live site's database is ever lost or
corrupted, separate from WordPress's own revision history. `.gitignore`
blanket-excludes `*.json` (for credential files) with an explicit
`!backups/*.json` exception so these are never accidentally skipped.

To take a fresh backup for a site, run via that site's `novamira/execute-php`:
```php
$posts = get_posts(['post_type'=>['post','page'],'post_status'=>'publish','numberposts'=>-1]);
$export = [];
foreach ($posts as $p) {
  $ed = get_post_meta($p->ID, '_elementor_data', true);
  $export[] = ['ID'=>$p->ID,'post_title'=>$p->post_title,'post_name'=>$p->post_name,
    'post_type'=>$p->post_type,'post_status'=>$p->post_status,'post_date'=>$p->post_date,
    'post_modified'=>$p->post_modified,'post_content'=>$p->post_content,
    'elementor_data'=>is_string($ed)?$ed:null,
    'elementor_edit_mode'=>get_post_meta($p->ID,'_elementor_edit_mode',true),
    'rank_math_title'=>get_post_meta($p->ID,'rank_math_title',true),
    'rank_math_description'=>get_post_meta($p->ID,'rank_math_description',true),
    'rank_math_focus_keyword'=>get_post_meta($p->ID,'rank_math_focus_keyword',true)];
}
$json = wp_json_encode(['site'=>'<domain>','exported_at'=>current_time('mysql'),
  'post_count'=>count($export),'posts'=>$export], JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);
file_put_contents('/tmp/backup.json', $json);
```
Then, since this session's sandbox cannot directly fetch the site's own
URLs (an org network policy blocks outbound browsing to arbitrary
domains), retrieve the data through the MCP tool's own text channel
instead of HTTP: `echo file_get_contents('/tmp/backup.json');` — for
anything past a few hundred KB this exceeds the tool's inline output
limit and gets auto-saved to a local `tool-results/*.txt` file (as
`{success, data: {output: "..."}}`); extract the real payload with
`jq -r '.data.output' <that file> > backups/<site>_<date>.json`, then
delete the `/tmp/backup.json` on the WordPress server. Never write the
export to `wp-content/uploads/` and fetch it over HTTPS — that path is
blocked by this session's network policy and briefly exposes full site
content at a guessable public URL.

## Elementor editing gotchas (found the hard way, twice)

- **Never edit `_elementor_data` or `post_content` via `wp_update_post()` or
  `update_post_meta()`.** Both run the value through `wp_unslash()`
  internally, which strips backslashes needed for valid JSON escaping
  (e.g. `\"` inside a widget's HTML setting, or `\/` in URLs) — silently
  corrupting the JSON into something `json_decode()` can no longer parse.
  This has broken a live homepage and several service pages this way.
  **Always write directly via `$wpdb->update($wpdb->postmeta, ['meta_value'=>$json], ['post_id'=>$id,'meta_key'=>'_elementor_data'])`**
  (or `$wpdb->update($wpdb->posts, ['post_content'=>$html], ['ID'=>$id])`
  for blog posts), after confirming `json_decode($json) !== null` on the
  string you're about to write. Encode with
  `wp_json_encode($data, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE)` to
  avoid needing escaped slashes in the first place.
- **After any such direct write, verify against the DB, not `get_post_meta()`.**
  Both sites run a persistent external object cache (LiteSpeed's own
  drop-in) that `$wpdb->update()` does not invalidate, so `get_post_meta()`
  can keep returning the pre-write value in the same or a later request.
  Re-read with `$wpdb->get_var("SELECT meta_value FROM {$wpdb->postmeta}
  WHERE post_id=%d AND meta_key='_elementor_data'")` to see the true
  current row, and call `wp_cache_flush()` (plus `clean_post_cache($id)`)
  before trusting any `get_post_*()` read again.
- **If `_elementor_data` ever comes back corrupted**, don't hand-repair the
  JSON — WordPress keeps full post revisions, and Elementor copies
  `_elementor_data` into each revision too. Find the last revision where
  `json_decode()` succeeds (`wp_get_post_revisions($id)`, newest first) and
  restore that value wholesale via the same direct `$wpdb->update()`.
- **A container's "classic" background color can silently depend on JS.**
  If Elementor emits the background-color rule scoped to
  `.elementor-element-XXXXX > .elementor-motion-effects-container > .elementor-motion-effects-layer`
  instead of directly on `.elementor-element-XXXXX`, the color only
  appears after Elementor's own motion-effects script runs client-side —
  which LiteSpeed's Guest-Mode JS delay (see above) can postpone past
  first paint, leaving the section looking unstyled/transparent. Check a
  page's generated CSS file
  (`wp-content/uploads/elementor/css/post-<id>.css`) for this pattern; the
  safe fix (Elementor free has no per-element Custom CSS) is a small
  `!important` override added via `wp_get_custom_css_post()` /
  `wp_update_custom_css_post()` (WordPress's native Additional CSS),
  targeting the specific `.elementor-element-<id>` selector directly —
  never edit the theme's own core CSS files to work around this.
