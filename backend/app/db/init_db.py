from backend.app.db.database import get_connection


CREATE_COMPLAINTS_TABLE = """
CREATE TABLE IF NOT EXISTS complaints (
    complaint_id TEXT PRIMARY KEY,
    date_opened TEXT,
    date_closed TEXT,
    status TEXT,
    channel TEXT,
    category TEXT,
    priority TEXT,
    region TEXT,
    source_system TEXT,
    transferred_between_systems INTEGER,
    sla_days INTEGER,
    days_to_close INTEGER,
    sla_breach INTEGER,
    reopened INTEGER,
    resolution_action TEXT,
    resolvable_by_information_only INTEGER,
    bill_correction_value REAL,
    account_id TEXT
);
"""


CREATE_DASHBOARD_METRICS_TABLE = """
CREATE TABLE IF NOT EXISTS dashboard_metrics (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    open_complaints INTEGER,
    average_resolution_days REAL,
    previous_resolution_days REAL,
    sla_breach_risk REAL,
    regulator_score REAL,
    regulator_target REAL,
    first_contact_resolution_rate REAL,
    inbound_calls INTEGER,
    cost_to_serve_per_account REAL
);
"""


CREATE_MONTHLY_METRICS_TABLE = """
CREATE TABLE IF NOT EXISTS monthly_metrics (
    month TEXT PRIMARY KEY,
    complaints_opened INTEGER,
    complaints_closed INTEGER,
    resolution_days REAL,
    first_contact_resolution_rate REAL,
    inbound_calls INTEGER,
    cost_to_serve_per_account REAL,
    regulator_score REAL
);
"""


def initialize_database() -> None:
    connection = get_connection()

    try:
        connection.execute(CREATE_COMPLAINTS_TABLE)
        connection.execute(CREATE_DASHBOARD_METRICS_TABLE)
        connection.execute(CREATE_MONTHLY_METRICS_TABLE)

        connection.commit()

    finally:
        connection.close()


if __name__ == "__main__":
    initialize_database()
    print("Database initialized successfully.")