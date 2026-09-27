from backend.app.db.database import get_connection


def get_complaints(
    page: int = 1,
    page_size: int = 50,
) -> dict:
    offset = (page - 1) * page_size

    connection = get_connection()

    try:
        total_cursor = connection.execute(
            "SELECT COUNT(*) AS count FROM complaints"
        )

        total = total_cursor.fetchone()["count"]

        cursor = connection.execute(
            """
            SELECT *
            FROM complaints
            ORDER BY date_opened DESC
            LIMIT ? OFFSET ?
            """,
            (page_size, offset),
        )

        complaints = [dict(row) for row in cursor.fetchall()]

        return {
            "page": page,
            "page_size": page_size,
            "total": total,
            "items": complaints,
        }

    finally:
        connection.close()


def get_complaint(complaint_id: str) -> dict | None:
    connection = get_connection()

    try:
        cursor = connection.execute(
            """
            SELECT *
            FROM complaints
            WHERE complaint_id = ?
            """,
            (complaint_id,),
        )

        complaint = cursor.fetchone()

        if complaint is None:
            return None

        return dict(complaint)

    finally:
        connection.close()