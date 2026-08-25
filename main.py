import argparse
import datetime

from src import config, ga4_client, gsc_client, report


def run(days):
    config.require_config()

    end = datetime.date.today() - datetime.timedelta(days=3)  # GSC data lags ~2-3 days
    start = end - datetime.timedelta(days=days)
    start_date, end_date = start.isoformat(), end.isoformat()

    print(f"Fetching Search Console + GA4 data for {start_date} to {end_date} ...")

    gsc_pages = gsc_client.pages_report(start_date, end_date)
    gsc_queries = gsc_client.queries_report(start_date, end_date)
    ga4_rows = ga4_client.landing_page_report(start_date, end_date)

    merged_pages = report.merge_traffic(gsc_pages, ga4_rows)
    quick_wins = report.quick_win_pages(gsc_pages)
    low_ctr = report.low_ctr_pages(gsc_pages)
    missed_queries = report.top_queries_no_page1(gsc_queries)

    report.write_csv(merged_pages, "outputs/pages_overview.csv")
    report.write_csv(quick_wins, "outputs/quick_win_pages.csv")
    report.write_csv(low_ctr, "outputs/low_ctr_pages.csv")
    report.write_csv(missed_queries, "outputs/missed_queries.csv")

    print(f"\n{len(gsc_pages)} pages, {len(gsc_queries)} queries analyzed.")
    print(f"Saved reports to outputs/ :")
    print("  - pages_overview.csv     (every page: clicks, impressions, position, GA4 sessions)")
    print("  - quick_win_pages.csv    (pages ranking #5-20 with search volume - improve these first)")
    print("  - low_ctr_pages.csv      (ranking well, few clicks - fix title/meta description)")
    print("  - missed_queries.csv     (queries with demand where we're not on page 1)")

    if quick_wins:
        print("\nTop quick-win page:")
        p = quick_wins[0]
        print(f"  {p['page']}  (pos {p['position']:.1f}, {p['impressions']} impressions, ctr {p['ctr']:.1%})")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fetch GA4 + Search Console data and generate an SEO report.")
    parser.add_argument("--days", type=int, default=28, help="Number of days to analyze (default 28)")
    args = parser.parse_args()
    run(args.days)
