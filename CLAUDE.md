# Research tools (set by the owner)

For any SEO, keyword or market research, use the connected Supermetrics sources instead of general knowledge. Re-check each source's `authentication_status` with `data_source_discovery` at the start of every research job.

| Source (Supermetrics ID) | Status on 2026-09-24 | Use for |
|---|---|---|
| Google Ads (`AW`) | Connected | Own campaign data only (CPC, search terms, quality score). It has no Keyword Planner search volume. |
| Google Ads Keyword Planner (`GAKEY`) | Not connected | Use the Windsor.ai route below instead. |
| Google Trends (`GT`) | No login needed | Relative interest by state or DMA, related and rising queries. It is an index, not volume. |
| Google Search Console (`GW`) | Connected | quranlyhub.com, hobartappliancecare.com |
| Google Analytics 4 (`GAWA`) | Connected | Own site traffic |
| YouTube (`YT2`) | Connected | YouTube data |
| Instagram Public Data (`IGPD2`) | Connected | Public Instagram data |
| Ahrefs (`AHRF2`), Semrush (`SR`) | Not connected | Backlinks, domain rating, keyword difficulty, once connected |

Rules: never make up search volume, CPC, keyword difficulty, domain rating or traffic. Write "Not verified" instead, label third-party numbers as estimates, and show conflicts between tools.

## Keyword Planner through Windsor.ai (working)

Use the Windsor.ai MCP: connector `google_ads`, account `631-332-2978` ("Local business").

- **Fields:** `keyword`, `avg_monthly_searches`, `keyword_competition`, `competition_index`, `top_of_page_bid_low` and `top_of_page_bid_high` (in micros, so divide by 1,000,000), and `monthly_searches` (with the date field for a 12-month trend). Don't request `keyword_text` together with these.
- **Options:** `keyword_seeds` (up to 20, comma-separated), `geo_target_constants`, `language` (`1000` = English).
- **Location:** `2840` is the United States. A DMA region is `200000` + its Nielsen DMA code, for example `200709` for Tyler-Longview, TX.
- **Currency: the account is in PKR.** Convert bids to USD and state the rate used, or report them in PKR. Never present PKR bids as USD.
- Broad seeds return thousands of rows, so save the output and filter it with `jq`.
