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



\## Stage 2 – Persistent Storage Design



\### 1. Database Choice

PostgreSQL is used because it is reliable, scalable, and ACID compliant.



\### 2. Schema Design

Users Table:

\- user\_id (PK)

\- name

\- email

\- created\_at



Notifications Table:

\- notification\_id (PK)

\- title

\- message

\- type

\- payload (JSONB)

\- created\_at



User\_Notifications Table:

\- id (PK)

\- user\_id (FK)

\- notification\_id (FK)

\- is\_read

\- read\_at

\- created\_at



\### 3. Problems at Scale

\- Large data slows queries

\- High traffic load

\- Database size increases



\### 4. Solutions

\- Indexing on user\_id

\- Partitioning by time

\- Redis caching

\- Kafka for async processing

\- Pagination



\### 5. SQL Queries



Get notifications:

SELECT \* FROM user\_notifications WHERE user\_id = 1;



Mark as read:

UPDATE user\_notifications

SET is\_read = true

WHERE user\_id = 1 AND notification\_id = 10;



Insert notification:

INSERT INTO notifications(title, message, type)

VALUES ('Hello', 'Test message', 'INFO');





\## Stage 3 – Query Optimization \& Performance



\### 1. Is the given query accurate?



Given query:

SELECT FROM notifications

WHERE studentID 1042 AND isRead false

ORDER BY createdAt ASC;



❌ This query is NOT correct.



\### Problems:

\- SELECT \* missing

\- Incorrect syntax for conditions

\- Boolean format wrong

\- Column naming inconsistent



\### Correct Query:

SELECT \*

FROM notifications

WHERE student\_id = 1042

AND is\_read = FALSE

ORDER BY created\_at ASC;



\---



\### 2. Why is this query slow?



This query is slow due to:



\- Large dataset (5,000,000+ records)

\- Full table scan if index is missing

\- ORDER BY sorting large data

\- Filtering on non-optimized columns



\---



\### 3. Improvements



To optimize performance:



\- Create composite index:

CREATE INDEX idx\_student\_unread

ON notifications(student\_id, is\_read, created\_at);



\- Use pagination:

SELECT \*

FROM notifications

WHERE student\_id = 1042

AND is\_read = FALSE

ORDER BY created\_at ASC

LIMIT 50;



\- Avoid SELECT \*

\- Fetch only required fields



\---



\### 4. Computation Cost



Without index:

\- Time Complexity: O(N)

\- Sorting: O(N log N)



With index:

\- Time Complexity: O(log N + k)



\---



\### 5. Is indexing every column a good idea?



❌ No, it is NOT a good idea.



\### Reasons:

\- Increases storage cost

\- Slows INSERT/UPDATE operations

\- Too many indexes reduce performance

\- Maintenance overhead increases



✔ Only important columns should be indexed.



\---



\### 6. Query: Placement notifications in last 7 days



SELECT \*

FROM notifications

WHERE notification\_type = 'Placement'

AND created\_at >= NOW() - INTERVAL '7 days';



\---



\### End of Stage 3

