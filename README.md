# Book Management System

A full-stack web application for managing books and users, featuring authentication, admin/user roles, and book link management.

## Features

- User registration and login with JWT authentication
- Admin and regular user roles
- Add, edit, delete, and view books (with optional links)
- Admin dashboard with user and book management
- Responsive UI built with React and Material-UI
- Backend REST API built with Spring Boot and MySQL

---

## Project Structure

```
book-management/
│
├── frontend/         # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── ...
│
├── src/              # Spring Boot backend (Java)
│   ├── main/
│   │   ├── java/
│   │   └── resources/
│   └── ...
├── pom.xml           # Maven backend build file
├── HELP.md           # Spring Boot help and references
└── ...
```

---

## Prerequisites

- **Java 21+**
- **Node.js 18+** and **npm**
- **MySQL 8+** (or compatible)

---

## Backend Setup (Spring Boot)

1. **Configure MySQL**

   - Create a database named `book_management` (auto-created if not exists).
   - Update `src/main/resources/application.properties` if your MySQL username/password differ:
     ```
     spring.datasource.username=YOUR_USERNAME
     spring.datasource.password=YOUR_PASSWORD
     ```

2. **Build and Run**

   ```
   ./mvnw spring-boot:run
   ```
   or on Windows:
   ```
   mvnw.cmd spring-boot:run
   ```

   The backend runs on [http://localhost:8082](http://localhost:8082) by default.

3. **Default Admin User**

   - Username: `badadmin`
   - Password: `badadmin`

   This user is created automatically on first run if not present.

---

## Frontend Setup (React + Vite)

1. **Install dependencies**

   ```
   cd frontend
   npm install
   ```

2. **Start the development server**

   ```
   npm run dev
   ```

   The frontend runs on [http://localhost:5173](http://localhost:5173) by default.

3. **API Configuration**

   - The frontend is pre-configured to use the backend at `http://localhost:8082`.
   - If you change backend ports, update the API base URL in the frontend code.

---

## Usage

- **Login** as admin (`badadmin` / `admin123`) or register a new user.
- **Admin** can:
  - View dashboard with user/book stats
  - Add/edit/delete books (including book links)
  - Manage users
- **Regular users** can:
  - View and search books
  - Add books (if permitted)
- **Book Links**: Add a URL to a book (e.g., purchase or info link). Displayed as a clickable button.

---

## Database Schema

- See `src/main/resources/schema.sql` for table definitions.
- Tables: `users`, `roles`, `user_roles`, `books`
- Book entity includes a `book_link` field for external URLs.

---

## Customization

- **CORS**: Configured to allow frontend port in backend.
- **JWT Secret**: Change `jwt.secret` in `application.properties` for production.
- **Logging**: Debug logging enabled for development.

---

## Troubleshooting

- **White screen or login issues**: Check browser console and backend logs.
- **MySQL connection errors**: Ensure MySQL is running and credentials are correct.
- **Port conflicts**: Make sure ports 8082 (backend) and 5173 (frontend) are free.

---

## References

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [Material-UI](https://mui.com/)
- [Vite](https://vitejs.dev/)

---

## License

This project is for educational/demo purposes. 
