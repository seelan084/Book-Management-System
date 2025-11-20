📱 Mytel – Mobile Recharge & Billing System

A full-stack telecom simulation project that allows users to register, recharge prepaid numbers, pay postpaid bills, view mobile profiles, and convert prepaid ↔ postpaid.
The project includes a Spring Boot backend deployed on Render and a static frontend hosted separately.

🚀 Features
✅ User Management

Register mobile numbers as Prepaid or Postpaid

Automatic validation for duplicate mobile numbers

Auto-creation of prepaid accounts on first recharge (if needed)

✅ Prepaid Module

Recharge prepaid mobile numbers

Update and display new balance

Restrict recharge for postpaid numbers

✅ Postpaid Module

Pay monthly bills

Auto-update outstanding bill after payment

Prevent payment for non-postpaid numbers

✅ Profile Module

Fetch user profile by mobile number

View account type, balance, outstanding bill

✅ Plan Conversion

Prepaid → Postpaid

Postpaid → Prepaid

Safety checks:

Postpaid bill must be cleared before conversion

Account type validation

🏗️ Tech Stack
Frontend

HTML5, CSS3, JavaScript

Modular JS structure (separate files for each module)

Node.js HTTPS server used during development

Hosted on Render static site service

Backend

Java 17

Spring Boot 3

Spring Web

Spring Data JPA

PostgreSQL (Render Cloud Database)

Hibernate ORM

Tools

IntelliJ IDEA / VS Code

Postman

Git & GitHub

Maven

Render (Hosting)

🌐 Live URLs

Frontend:
🔗 https://mytelproject.onrender.com

Backend (REST API):
🔗 https://mytel-backend.onrender.com

📂 Project Structure
MytelProject/
│
├── backend/
│   ├── src/main/java/com/mytel/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   └── resources/application.properties
│
└── frontend/
    ├── prepaid/
    ├── postpaid/
    ├── profile/
    ├── register/
    ├── js/
    ├── css/
    └── index.html

🔌 API Endpoints
Register
POST /api/register

Prepaid Recharge
POST /api/prepaid/recharge

Postpaid Bill Payment
POST /api/postpaid/paybill

Profile
GET /api/profile/{mobile}

Conversions
PUT /api/convert/prepaid-to-postpaid/{mobile}
PUT /api/convert/postpaid-to-prepaid/{mobile}

📦 Backend Setup (Local)
1. Clone repository
git clone https://github.com/your-repo/MytelProject.git

2. Configure database

In application.properties:

spring.datasource.url=jdbc:postgresql://localhost:5432/mytel_db
spring.datasource.username=postgres
spring.datasource.password=your-password
spring.jpa.hibernate.ddl-auto=update

3. Run backend
mvn spring-boot:run

🌐 Frontend Setup (Local)
cd frontend
node server.js


Then open:

https://localhost:5500

🛠️ Deployment (Render)
Backend

Build command:
mvn clean install -DskipTests

Start command:
java -jar target/*.jar

Frontend

Publish directory: frontend/

Build command: (empty)

📘 Summary

Mytel is a complete end-to-end telecom simulation app showcasing:

REST API development

Database design

Cloud deployment

Full-stack integration

Real telecom workflows (Recharge, Billing, Conversion)

Perfect for interviews, portfolio, and demonstrating full-stack development skills.
