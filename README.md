📱 MYTEL – MOBILE RECHARGE & BILLING SYSTEM

A full-stack telecom simulation project that allows users to register, recharge prepaid numbers, pay postpaid bills, view profiles, and convert between PREPAID ↔ POSTPAID.
Built using Java Spring Boot (backend) and HTML/CSS/JS (frontend), deployed on Render.

🚀 PROJECT OVERVIEW

Mytel is a telecom account management system that allows:

Prepaid recharge

Postpaid bill payments

Fetching user profile

Creating new accounts

Converting between prepaid and postpaid plans

This project provides a real-world billing workflow used in telecom systems, demonstrating backend logic, database interactions, and frontend integration.

🛠️ TOOLS & TECHNOLOGIES
Backend

Java 17

Spring Boot 3

Spring Web

Spring Data JPA

PostgreSQL (Render Cloud Database)

Hibernate ORM

Maven

Frontend

HTML5

CSS3

JavaScript (Fetch API)

Deployment

Render Web Service (Backend)

Render Static Site (Frontend)

🌐 LIVE LINKS
🔹 Frontend (UI):

👉 https://mytelproject.onrender.com

🔹 Backend API (REST):

👉 https://mytel-backend.onrender.com

✨ KEY FEATURES
1. User Registration

Register a mobile number as PREPAID or POSTPAID

Stored in PostgreSQL database

2. Prepaid Recharge

Recharge any PREPAID number

If number not registered → auto-creates a prepaid account

Updates wallet balance

3. Postpaid Bill Payment

Pay outstanding bills for POSTPAID accounts

Ensures outstanding never goes below zero

4. Profile Lookup

View full account details:

Mobile number

Account type

Balance

Outstanding bill

5. Prepaid ↔ Postpaid Conversion

Validations:

Postpaid → Prepaid requires bill clearance

Prevent invalid conversions

6. Real Backend Integration

All pages call the backend via Fetch API

API responses rendered dynamically on UI

📂 PROJECT STRUCTURE
MytelProject/
│
├── backend/
│   ├── src/main/java/com/mytel/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── service/impl/
│   │   ├── repository/
│   │   └── model/
│   ├── src/main/resources/
│   └── pom.xml
│
├── frontend/
│   ├── index.html
│   ├── pages/
│   ├── js/
│   ├── css/
│   └── assets/
│
└── README.md

⚙️ BACKEND SETUP (LOCAL)
1. Clone Repository
git clone https://github.com/your-username/MytelProject

2. Update PostgreSQL Credentials

Edit:
backend/src/main/resources/application.properties

spring.datasource.url=jdbc:postgresql://localhost:5432/mytel_db
spring.datasource.username=your_user
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

3. Run Backend
mvn spring-boot:run


Backend runs on:
👉 http://localhost:8080

💻 FRONTEND SETUP (LOCAL)
1. Open frontend folder
cd frontend

2. Start with Live Server (VS Code)
Right click → "Open with Live Server"


Frontend runs on:
👉 http://127.0.0.1:5500

🧩 IMPORTANT API ENDPOINTS
Prepaid Recharge
POST /api/prepaid/recharge

Register User
POST /api/register

Postpaid Bill Pay
POST /api/postpaid/paybill

Profile Fetch
GET /api/profile/{mobile}

Conversion
PUT /api/convert/prepaid-to-postpaid/{mobile}
PUT /api/convert/postpaid-to-prepaid/{mobile}

☁️ DEPLOYMENT (Render)
Backend

Build using Dockerfile

Auto deploys on commit

Uses Render PostgreSQL database

Frontend

Render Static Site

Publish directory: frontend

No build command (pure HTML/CSS/JS)

📘 PROJECT SUMMARY

Mytel is a complete telecom management system simulating real prepaid/postpaid workflows.
It demonstrates your ability to:

✔ Build REST APIs in Spring Boot
✔ Integrate frontend → backend
✔ Manage PostgreSQL with JPA
✔ Deploy full-stack projects on Render
✔ Handle real telecom scenarios (billing, recharge, profile management)
