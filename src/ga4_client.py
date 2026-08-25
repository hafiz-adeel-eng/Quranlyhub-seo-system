from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
from google.oauth2 import service_account

from . import config

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]


def _client():
    creds = service_account.Credentials.from_service_account_file(
        config.GOOGLE_APPLICATION_CREDENTIALS, scopes=SCOPES
    )
    return BetaAnalyticsDataClient(credentials=creds)


def landing_page_report(start_date, end_date, limit=1000):
    """Sessions/users/engagement per landing page."""
    client = _client()
    request = RunReportRequest(
        property=f"properties/{config.GA4_PROPERTY_ID}",
        dimensions=[Dimension(name="landingPagePlusQueryString")],
        metrics=[
            Metric(name="sessions"),
            Metric(name="activeUsers"),
            Metric(name="averageSessionDuration"),
            Metric(name="bounceRate"),
        ],
        date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
        limit=limit,
    )
    response = client.run_report(request)
    rows = []
    for row in response.rows:
        rows.append(
            {
                "landing_page": row.dimension_values[0].value,
                "sessions": int(row.metric_values[0].value),
                "active_users": int(row.metric_values[1].value),
                "avg_session_duration": float(row.metric_values[2].value),
                "bounce_rate": float(row.metric_values[3].value),
            }
        )
    return rows
