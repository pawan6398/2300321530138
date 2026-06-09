import requests
from datetime import datetime

API_URL = "http://4.224.186.213/evaluation-service/notifications"

# Priority mapping
PRIORITY = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
}

# -----------------------------
# Fetch notifications (API + fallback)
# -----------------------------
def fetch_notifications():
    headers = {
        "Authorization": "Bearer test-token"
    }

    try:
        response = requests.get(API_URL, headers=headers, timeout=5)
        response.raise_for_status()

        data = response.json()

        if isinstance(data, dict) and "notifications" in data:
            return data["notifications"]

        return []

    except Exception as e:
        print("API unreachable, using fallback data:", e)

        # fallback mock data (ensures program always works)
        return [
            {"Type": "Placement", "Message": "Company hiring announcement", "Timestamp": "2026-04-22 17:51:30"},
            {"Type": "Result", "Message": "Mid-sem result declared", "Timestamp": "2026-04-22 17:50:30"},
            {"Type": "Event", "Message": "Tech fest coming soon", "Timestamp": "2026-04-22 17:49:30"},
            {"Type": "Result", "Message": "Project review completed", "Timestamp": "2026-04-22 17:48:30"},
            {"Type": "Placement", "Message": "Interview call received", "Timestamp": "2026-04-22 17:47:30"},
        ]

# -----------------------------
# Parse timestamp safely
# -----------------------------
def parse_date(ts):
    try:
        return datetime.strptime(ts, "%Y-%m-%d %H:%M:%S")
    except:
        return datetime.min

# -----------------------------
# Get Top N Notifications
# -----------------------------
def get_top_notifications(notifications, top_n=10):

    processed = []

    for n in notifications:
        if not isinstance(n, dict):
            continue

        n_type = n.get("Type", "")
        timestamp = n.get("Timestamp", "")

        n["priority_score"] = PRIORITY.get(n_type, 0)
        n["parsed_time"] = parse_date(timestamp)

        processed.append(n)

    # Sort by priority first, then recency
    sorted_notifications = sorted(
        processed,
        key=lambda x: (x["priority_score"], x["parsed_time"]),
        reverse=True
    )

    return sorted_notifications[:top_n]

# -----------------------------
# Main function
# -----------------------------
def main():

    notifications = fetch_notifications()

    if not notifications:
        print("No notifications found.")
        return

    top_notifications = get_top_notifications(notifications, 10)

    print("\n🔥 TOP 10 PRIORITY NOTIFICATIONS:\n")

    for i, n in enumerate(top_notifications, 1):
        print(f"{i}. [{n.get('Type')}] {n.get('Message')} - {n.get('Timestamp')}")

# Run program
if __name__ == "__main__":
    main()