import json
import os
import random
import time
from datetime import datetime, timezone

import requests

AGENT_ID = os.getenv("AGENT_ID", "web-python-agent-01")
AGENT_TYPE = os.getenv("AGENT_TYPE", "web")
AGENT_VERSION = os.getenv("AGENT_VERSION", "0.1.0")
LTS_CHANNEL = os.getenv("LTS_CHANNEL", "stable")

MANAGER_API_URL = os.getenv(
    "MANAGER_API_URL",
    "http://manager-api-service:5000/api/v1/events"
)

MESSAGES = [
    "Mock suspicious login attempt detected",
    "Mock abnormal HTTP request pattern detected",
    "Mock SQL injection signature detected",
    "Mock brute force activity detected",
]

print(f"Starting {AGENT_ID}", flush=True)

while True:
    risk_score = random.randint(1, 100)

    if risk_score < 40:
        severity = "low"
    elif risk_score < 70:
        severity = "medium"
    elif risk_score < 90:
        severity = "high"
    else:
        severity = "critical"

    event = {
        "agent_id": AGENT_ID,
        "agent_type": AGENT_TYPE,
        "version": AGENT_VERSION,
        "lts_channel": LTS_CHANNEL,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": "healthy",
        "event_type": "web_detection",
        "severity": severity,
        "risk_score": risk_score,
        "message": random.choice(MESSAGES),
    }

    try:
        response = requests.post(
            MANAGER_API_URL,
            json=event,
            timeout=5
        )

        print(
            f"sent event severity={severity} status={response.status_code}",
            flush=True
        )

    except Exception as e:
        print(f"failed to send event: {e}", flush=True)

    time.sleep(5)
