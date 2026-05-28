from flask import Blueprint

from app.core.store import INCIDENTS

incidents_bp = Blueprint("incidents", __name__)


@incidents_bp.get("/incidents")
def list_incidents():
    return {
        "count": len(INCIDENTS),
        "items": INCIDENTS[:25],
    }
