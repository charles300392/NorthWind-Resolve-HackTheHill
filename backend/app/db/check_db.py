from backend.app.db.database import get_connection


def check_database() -> None:
    connection = get_connection()

    try:
        cursor = connection.execute(
            "SELECT COUNT(*) AS count FROM complaints"
        )

        result = cursor.fetchone()

        print(f"Complaints in database: {result['count']}")

    finally:
        connection.close()


if __name__ == "__main__":
    check_database()