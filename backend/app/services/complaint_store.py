from __future__ import annotations

import json
from pathlib import Path
from threading import RLock

from backend.app.data.loader import PROJECT_ROOT


STORE_DIR = PROJECT_ROOT / "data" / "runtime"
STORE_PATH = STORE_DIR / "new_complaints.json"
LOCK = RLock()


def _ensure_store() -> None:
    STORE_DIR.mkdir(parents=True, exist_ok=True)
    if not STORE_PATH.exists():
        STORE_PATH.write_text("[]", encoding="utf-8")


def load_new_complaints() -> list[dict]:
    with LOCK:
        _ensure_store()
        try:
            data = json.loads(STORE_PATH.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            data = []
        return data if isinstance(data, list) else []


def append_complaint(record: dict) -> dict:
    with LOCK:
        records = load_new_complaints()
        records.append(record)
        STORE_PATH.write_text(
            json.dumps(records, indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
        return record


def find_complaint(complaint_id: str) -> dict | None:
    return next(
        (
            record
            for record in load_new_complaints()
            if str(record.get("complaint_id")) == complaint_id
        ),
        None,
    )
