from datetime import datetime, timezone

AGENTS = {}
INCIDENTS = []


def now_iso():
    return datetime.now(timezone.utc).isoformat()
