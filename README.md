# Users & Courses — Full-Stack Architecture Example

A small React + Express + PostgreSQL app designed to **teach backend architecture**.

It is a working product (users, courses, authentication, CRUD) and a teaching tool: the UI includes an Architecture page and an API Explorer that show how a request moves through the server.

```
React Frontend
    ↓
API Request
    ↓
Routes
    ↓
Middleware
    ↓
Controller
    ↓
Service
    ↓
Model
    ↓
PostgreSQL
```

---

## 1. Project overview

The original project was a single registration form:

- React posted `{ name, email, courseIds }` to `POST /api/users`
- Express listed courses from `GET /api/courses`
- PostgreSQL stored `users`, `courses`, and `user_courses`

That behavior is still here. The refactor organizes the backend into clear layers, adds the rest of the REST surface, and uses the frontend to explain those layers.

**What you can demonstrate**

- Users and courses as two REST resources
- Authentication with JWT
- API requests from React
- Backend routes, middleware, controllers, services, and models
- Create, read, update, delete

---

## 2. Technologies used

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL (`pg` pool) |
| Auth | `bcryptjs` password hashes, `jsonwebtoken` |
| HTTP | `fetch` via `frontend/src/api/client.js` |

No extra UI kit, no ORM, no router library. The goal is that a beginner can open a folder and see what it is for.

---

## 3. Folder structure

```
react_postgre/
├── README.md
├── frontend/
│   ├── src/
│   │   ├── api/client.js          # React → HTTP
│   │   ├── components/            # Reusable UI
│   │   ├── context/AuthContext.jsx
│   │   ├── data/                  # Architecture + route catalog
│   │   ├── pages/                 # Overview, Users, Courses, Auth, Architecture, API Explorer
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
└── backend/
    ├── config/database.js         # PostgreSQL pool
    ├── routes/                    # URL → middleware → controller
    ├── controllers/               # HTTP request / response
    ├── services/                  # Business rules
    ├── models/                    # SQL only
    ├── middleware/                # Auth, validation, errors
    ├── validators/                # Input rules
    ├── utils/                     # AppError, asyncHandler, JWT helpers
    ├── scripts/schema.sql
    ├── scripts/init-db.js
    ├── app.js                     # Express app
    └── server.js                  # listen()
```

---

## 4. Backend architecture

Each folder has one job:

| Folder | Responsibility |
| --- | --- |
| `routes/` | Declare endpoints. Stay thin. |
| `middleware/` | Run between the route and the controller. |
| `controllers/` | Read `req`, call a service, send `res`. |
| `services/` | Business rules. No SQL. No `res.json`. |
| `models/` | Parameterized SQL against PostgreSQL. |
| `config/` | Database pool. |
| `validators/` | Pure functions that return error strings. |

---

## 5. Request lifecycle

Example: creating a course from the React form.

```
React Form                  pages/Courses.jsx
    ↓
POST /api/courses           api/client.js
    ↓
course.routes.js            POST / + requireAuth + validate
    ↓
validation middleware       validators/course.validator.js
    ↓
auth middleware             middleware/auth.middleware.js
    ↓
course.controller.js        createCourse()
    ↓
course.service.js           trim name, coerce price
    ↓
course.model.js             INSERT INTO courses ...
    ↓
PostgreSQL
    ↓
JSON response               201 { message, course }
    ↓
React UI                    table refresh + success alert
```

The Architecture page in the app shows this same path.

---

## 6. Routes

Routes live in `backend/routes/` and are mounted in `app.js`:

```js
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
```

### Authentication — `/api/auth`

| Method | Route | Purpose | Auth |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Create an account + JWT | Public |
| POST | `/api/auth/login` | Sign in + JWT | Public |
| GET | `/api/auth/me` | Current token payload | JWT |

### Users — `/api/users`

| Method | Route | Purpose | Auth |
| --- | --- | --- | --- |
| GET | `/api/users` | Get all users | Public |
| GET | `/api/users/:id` | Get one user | Public |
| POST | `/api/users` | Create user (original registration) | Public |
| PUT | `/api/users/:id` | Update user | JWT |
| DELETE | `/api/users/:id` | Delete user | JWT |

### Courses — `/api/courses`

| Method | Route | Purpose | Auth |
| --- | --- | --- | --- |
| GET | `/api/courses` | Get all courses | Public |
| GET | `/api/courses/:id` | Get one course | Public |
| POST | `/api/courses` | Create course | JWT |
| PUT | `/api/courses/:id` | Update course | JWT |
| DELETE | `/api/courses/:id` | Delete course | JWT |

Preserved from the original server:

- `GET /` — `{ message: "Backend is running!" }`
- `GET /api/test-db` — checks the PostgreSQL connection
- `GET /api/courses` — still returns a course array
- `POST /api/users` — still accepts `{ name, email, courseIds }`

---

## 7. Controllers

`backend/controllers/` turn HTTP into service calls.

`user.controller.js`

- `getUsers()`
- `getUserById()`
- `createUser()`
- `updateUser()`
- `deleteUser()`

Controllers do **not** contain SQL. If you need to change how a user is saved, look in the service or model.

---

## 8. Services

`backend/services/` hold rules that are not HTTP and not SQL:

- Reject unknown `courseIds`
- Normalize email
- Translate Postgres unique-violation `23505` into a 409
- Hash passwords and issue JWTs (`auth.service.js`)

---

## 9. Models

`backend/models/` are the only files that run SQL.

- `user.model.js` — `users` and `user_courses`
- `course.model.js` — `courses`

Queries use `$1, $2` parameters. Multi-step writes (user + enrollments) use a transaction (`BEGIN` / `COMMIT` / `ROLLBACK`).

---

## 10. Middleware

`backend/middleware/`

| File | Role |
| --- | --- |
| `auth.middleware.js` | `requireAuth` — Bearer JWT → `req.user` |
| `validation.middleware.js` | `validate(fn)` — run a validator before the controller |
| `error.middleware.js` | `notFound` + `errorHandler` — consistent `{ error }` JSON |

---

## 11. PostgreSQL / database layer

The original schema is kept. Courses use `name`, `description`, and `price` — not title / instructor.

```
users          id, name, email, created_at, password?
courses        id, name, description, price, created_at
user_courses   user_id, course_id
```

`password` is optional so existing rows keep working. Login requires a password created through `POST /api/auth/register`.

Connection settings are read once in `backend/config/database.js`.

Initialize or update the schema (safe to re-run):

```bash
cd backend
npm run init-db
```

If `courses` is empty, the script inserts three sample courses.

---

## 12. How to run the frontend

```bash
cd frontend
npm install
npm run dev
```

Vite serves the UI at [http://localhost:5173](http://localhost:5173).

Optional: copy `frontend/.env.example` to `frontend/.env` if the API is not on `http://localhost:5000`.

```bash
npm run build    # production bundle
```

---

## 13. How to run the backend

```bash
cd backend
npm install
copy .env.example .env    # then edit values (Windows)
# cp .env.example .env    # macOS / Linux
npm run init-db
npm run dev               # node --watch server.js
# or: npm start
```

The API listens on [http://localhost:5000](http://localhost:5000).

---

## 14. Environment variables

`backend/.env`

| Variable | Purpose |
| --- | --- |
| `PORT` | Express port (default `5000`) |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Signing key for tokens (change this) |
| `NODE_ENV` | `development` or `production` |

`frontend/.env`

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Backend origin, default `http://localhost:5000` |

Never commit `.env`. `.env.example` files are safe to commit.

---

## 15. Example API requests

```bash
# Health
curl http://localhost:5000/

# Database check
curl http://localhost:5000/api/test-db

# Public reads
curl http://localhost:5000/api/courses
curl http://localhost:5000/api/users

# Original registration (no password)
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Grace Hopper\",\"email\":\"grace@example.com\",\"courseIds\":[1]}"

# Auth
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Ada Lovelace\",\"email\":\"ada@example.com\",\"password\":\"secret123\"}"

# Use the token from the register/login response
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"name\":\"React Fundamentals\",\"description\":\"Components and hooks\",\"price\":499}"
```

---

## 16. Example request flow

**POST /api/users** (the original form)

1. `Users.jsx` validates name and email in the browser
2. `api.createUser()` sends JSON to Express
3. `user.routes.js` matches `POST /`
4. `validateCreateUser` rejects empty or invalid fields
5. `user.controller.createUser` reads `req.body`
6. `user.service.createUser` checks that each course id exists
7. `user.model.create` inserts the user and `user_courses` rows in a transaction
8. PostgreSQL returns the new row
9. The controller responds `201` with `{ message, user, courseIds }`
10. The React table reloads from `GET /api/users`

Open **Architecture** and **API Explorer** in the UI to walk through the same path live.

---

## Teaching the project

Suggested order:

1. Overview page — the stack in one sentence
2. Users / Courses — working CRUD
3. Authentication — why some buttons need a token
4. API Explorer — click `POST /api/courses`
5. Open the matching files in `backend/`
6. Architecture page — click each layer

Someone new to the codebase should be able to say:

- Routes go in `backend/routes/`
- Controllers go in `backend/controllers/`
- Services go in `backend/services/`
- Models go in `backend/models/`
- Middleware goes in `backend/middleware/`
- The database pool is in `backend/config/database.js`
