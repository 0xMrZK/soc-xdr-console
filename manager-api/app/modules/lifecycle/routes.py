from flask import Blueprint

lifecycle_bp = Blueprint("lifecycle", __name__)


@lifecycle_bp.get("/lifecycle")
def lifecycle():
    return {
        "strategy": "Simple LTS policy for detection agents",
        "channels": [
            {
                "name": "experimental",
                "description": "New detection logic, unstable, fast iteration",
                "support": "No LTS guarantee",
            },
            {
                "name": "stable",
                "description": "Validated detection logic for production rollout",
                "support": "Security fixes and minor improvements",
            },
            {
                "name": "lts",
                "description": "Long-term support branch for critical environments",
                "support": "Security fixes only, 24 months support window",
            },
        ],
        "versions": [
            {
                "version": "0.1.x",
                "channel": "experimental",
                "status": "active development",
                "eol": "2026-08-31",
            },
            {
                "version": "1.0.x",
                "channel": "stable",
                "status": "planned",
                "eol": "2027-05-31",
            },
            {
                "version": "1.0.x-lts",
                "channel": "lts",
                "status": "planned",
                "eol": "2028-05-31",
            },
        ],
    }
