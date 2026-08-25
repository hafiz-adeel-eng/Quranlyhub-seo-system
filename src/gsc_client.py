from google.oauth2 import service_account
from googleapiclient.discovery import build

from . import config

SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]


def _service():
    creds = service_account.Credentials.from_service_account_file(
        config.GOOGLE_APPLICATION_CREDENTIALS, scopes=SCOPES
    )
    return build("searchconsole", "v1", credentials=creds)


def query(start_date, end_date, dimensions, row_limit=1000, start_row=0):
    """Run a Search Analytics query and return the raw list of row dicts."""
    service = _service()
    body = {
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": dimensions,
        "rowLimit": row_limit,
        "startRow": start_row,
    }
    response = service.searchanalytics().query(siteUrl=config.GSC_SITE_URL, body=body).execute()
    return response.get("rows", [])


def pages_report(start_date, end_date, row_limit=1000):
    """Per-page clicks/impressions/ctr/position."""
    rows = query(start_date, end_date, dimensions=["page"], row_limit=row_limit)
    return [
        {
            "page": r["keys"][0],
            "clicks": r["clicks"],
            "impressions": r["impressions"],
            "ctr": r["ctr"],
            "position": r["position"],
        }
        for r in rows
    ]


def queries_report(start_date, end_date, row_limit=1000):
    """Per-query clicks/impressions/ctr/position."""
    rows = query(start_date, end_date, dimensions=["query"], row_limit=row_limit)
    return [
        {
            "query": r["keys"][0],
            "clicks": r["clicks"],
            "impressions": r["impressions"],
            "ctr": r["ctr"],
            "position": r["position"],
        }
        for r in rows
    ]
