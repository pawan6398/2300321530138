\# Stage 1 — Notification System Design



\## Objective



Design REST APIs for a campus notification platform to deliver notifications related to Placements, Events, and Results.



Authentication is assumed to be pre-authorized.



\---



\# Base URL



```text

/api/v1

```



\---



\# Headers



All endpoints accept:



```http

Content-Type: application/json

Accept: application/json

```



\---



\# Notification Object



```json

{

&#x20; "id": "string",

&#x20; "title": "string",

&#x20; "message": "string",

&#x20; "category": "placement | event | result",

&#x20; "priority": "low | medium | high",

&#x20; "createdAt": "ISO\_TIMESTAMP",

&#x20; "isRead": false

}

```



\---



\# 1. Get User Notifications



\## Endpoint



```http

GET /notifications

```



\## Query Parameters



```text

page

limit

category

isRead

```



\## Response



```json

{

&#x20; "success": true,

&#x20; "notifications": \[

&#x20;   {

&#x20;     "id": "N101",

&#x20;     "title": "Placement Update",

&#x20;     "message": "Company registration started",

&#x20;     "category": "placement",

&#x20;     "priority": "high",

&#x20;     "createdAt": "2026-06-09T08:00:00Z",

&#x20;     "isRead": false

&#x20;   }

&#x20; ]

}

```



\---



\# 2. Get Notification Details



\## Endpoint



```http

GET /notifications/{notificationId}

```



\## Response



```json

{

&#x20; "success": true,

&#x20; "notification": {

&#x20;   "id": "N101",

&#x20;   "title": "Placement Update",

&#x20;   "message": "Company registration started",

&#x20;   "category": "placement",

&#x20;   "priority": "high",

&#x20;   "isRead": false

&#x20; }

}

```



\---



\# 3. Mark Notification as Read



\## Endpoint



```http

PATCH /notifications/{notificationId}/read

```



\## Request



```json

{

&#x20; "isRead": true

}

```



\## Response



```json

{

&#x20; "success": true,

&#x20; "message": "Notification marked as read"

}

```



\---



\# 4. Mark All Notifications as Read



\## Endpoint



```http

PATCH /notifications/read-all

```



\## Response



```json

{

&#x20; "success": true,

&#x20; "message": "All notifications updated"

}

```



\---



\# 5. Create Notification



\## Endpoint



```http

POST /notifications

```



\## Request



```json

{

&#x20; "title": "Exam Result Published",

&#x20; "message": "Semester result available",

&#x20; "category": "result",

&#x20; "priority": "high"

}

```



\## Response



```json

{

&#x20; "success": true,

&#x20; "notificationId": "N102"

}

```



\---



\# 6. Delete Notification



\## Endpoint



```http

DELETE /notifications/{notificationId}

```



\## Response



```json

{

&#x20; "success": true,

&#x20; "message": "Notification removed"

}

```



\---



\# Real-Time Notification Mechanism



Use WebSocket-based communication.



\## Connection



```http

ws://server/notifications/live

```



\## Event Structure



```json

{

&#x20; "event": "notification\_received",

&#x20; "data": {

&#x20;   "id": "N201",

&#x20;   "title": "New Placement Notice",

&#x20;   "category": "placement"

&#x20; }

}

```



\## Flow



1\. Client connects to WebSocket.

2\. Server pushes notifications instantly.

3\. Frontend updates UI without refresh.

4\. Notification status syncs automatically.



\---



\# Design Principles



\* RESTful naming conventions

\* Predictable JSON structure

\* Pagination support

\* Real-time delivery

\* Extensible API versioning



