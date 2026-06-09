import requests
from datetime import datetime

API_URL = "http://4.224.186.213/evaluation-service/notifications"

# Priority mapping
PRIORITY = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
}

# ---------------------------
# MOCK DATA (fallback)
# ---------------------------
def mock_notifications():
    return [
        {"notificationType": "Placement", "message": "Job offer from ABC Company", "createdAt": "2026-06-08 10:00:00"},
        {"notificationType": "Result", "message": "Exam result declared", "createdAt": "2026-06-07 09:00:00"},
        {"notificationType": "Event", "message": "Tech event tomorrow", "createdAt": "2026-06-06 08:00:00"},
        {"notificationType": "Placement", "message": "Interview call from XYZ", "createdAt": "2026-06-05 11:00:00"},
        {"notificationType": "Result", "message": "Assignment marks published", "createdAt": "2026-06-04 12:00:00"},
    ]

# ---------------------------
# Fetch notifications
# ---------------------------
def fetch_notifications():
    headers = {
        "Authorization": "Bearer test-token"
    }

    try:
        response = requests.get(API_URL, headers=headers, timeout=5)

        if response.status_code != 200:
            print("API failed, using mock data.")
            return mock_notifications()

        data = response.json()

        if isinstance(data, dict) and "data" in data:
            return data["data"]

        if isinstance(data, list):
            return data

        return mock_notifications()

    except Exception as e:
        print("Error fetching API, using mock data:", e)
        return mock_notifications()

# ---------------------------
# Parse date safely
# ---------------------------
def parse_date(date_str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
    except:
        return datetime.min

# ---------------------------
# Get Top N notifications
# ---------------------------
def get_top_notifications(notifications, top_n=10):

    processed = []

    for n in notifications:
        if not isinstance(n, dict):
            continue

        n_type = n.get("notificationType", "")
        created_at = n.get("createdAt", "")

        n["priority_score"] = PRIORITY.get(n_type, 0)
        n["parsed_date"] = parse_date(created_at)

        processed.append(n)

    # Sort by priority + recency
    sorted_notifications = sorted(
        processed,
        key=lambda x: (x["priority_score"], x["parsed_date"]),
        reverse=True
    )

    return sorted_notifications[:top_n]

# ---------------------------
# Main function
# ---------------------------
def main():

    notifications = fetch_notifications()

    if not notifications:
        print("No notifications found.")
        return

    top_notifications = get_top_notifications(notifications, 10)

    print("\n🔥 TOP 10 PRIORITY NOTIFICATIONS:\n")

    for i, n in enumerate(top_notifications, 1):
        print(f"{i}. [{n.get('notificationType')}] {n.get('message')} - {n.get('createdAt')}")

# Run program
if __name__ == "__main__":
    main()