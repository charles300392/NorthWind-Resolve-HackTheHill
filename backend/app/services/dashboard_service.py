from backend.app.db.database import get_connection


def get_dashboard_metrics() -> dict | None:
    connection = get_connection()

    try:
        cursor = connection.execute(
            """
            SELECT
                open_complaints,
                average_resolution_days,
                previous_resolution_days,
                sla_breach_risk,
                regulator_score,
                regulator_target,
                first_contact_resolution_rate,
                inbound_calls,
                cost_to_serve_per_account
            FROM dashboard_metrics
            WHERE id = 1
            """
        )

        row = cursor.fetchone()

        if row is None:
            return None

        return dict(row)

    finally:
        connection.close()


def get_monthly_metrics() -> list[dict]:
    connection = get_connection()

    try:
        cursor = connection.execute(
            """
            SELECT
                month,
                complaints_opened,
                complaints_closed,
                resolution_days,
                first_contact_resolution_rate,
                inbound_calls,
                cost_to_serve_per_account,
                regulator_score
            FROM monthly_metrics
            ORDER BY month ASC
            """
        )

        return [dict(row) for row in cursor.fetchall()]

    finally:
        connection.close()