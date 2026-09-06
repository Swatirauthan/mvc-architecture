export const layers = [
  {
    id: "frontend",
    title: "React Frontend",
    short: "UI and forms",
    purpose:
      "The React app collects input, validates it in the browser, and sends HTTP requests to the API. It never talks to PostgreSQL directly.",
    location: "frontend/src/",
    exampleFile: "pages/Courses.jsx, api/client.js",
    connection: "React → API request",
    examples: [
      "User fills in the Create Course form",
      "api.createCourse() calls fetch('http://localhost:5000/api/courses')",
    ],
  },
  {
    id: "api",
    title: "API Request",
    short: "HTTP to Express",
    purpose:
      "A request is an HTTP method + URL + optional JSON body and headers. Express receives it on port 5000.",
    location: "Sent by frontend/src/api/client.js",
    exampleFile: "POST /api/courses",
    connection: "API request → Routes",
    examples: [
      "POST /api/courses",
      "Authorization: Bearer <token>",
      'Body: { "name": "React Fundamentals", "description": "Components and hooks", "price": 499 }',
    ],
  },
  {
    id: "routes",
    title: "Routes",
    short: "URL → handler",
    purpose:
      "Routes define the API endpoints of the application and determine which middleware and controller should handle each request.",
    location: "backend/routes/",
    exampleFile: "user.routes.js, course.routes.js, auth.routes.js",
    connection: "Route → Middleware → Controller",
    examples: [
      "GET /api/users",
      "POST /api/users",
      "GET /api/courses",
      "POST /api/courses",
    ],
  },
  {
    id: "middleware",
    title: "Middleware",
    short: "Runs before the controller",
    purpose:
      "Middleware runs between the incoming request and the controller. Use it for authentication, validation, and error handling.",
    location: "backend/middleware/",
    exampleFile: "auth.middleware.js, validation.middleware.js, error.middleware.js",
    connection: "Route → Middleware → Controller",
    examples: [
      "Authentication — require a JWT",
      "Authorization — decide who may change data",
      "Validation — reject invalid bodies early",
      "Error handling — turn exceptions into JSON",
    ],
  },
  {
    id: "controllers",
    title: "Controllers",
    short: "HTTP in, JSON out",
    purpose:
      "Controllers receive the HTTP request, call the required business logic, and send the response. They should not contain large amounts of database logic.",
    location: "backend/controllers/",
    exampleFile: "user.controller.js, course.controller.js",
    connection: "Route → Controller → Service",
    examples: [
      "getUsers(), getUserById()",
      "createUser(), updateUser(), deleteUser()",
      "createCourse(), updateCourse()",
    ],
  },
  {
    id: "services",
    title: "Services",
    short: "Business rules",
    purpose:
      "Services contain business logic: uniqueness checks, hashing passwords, verifying that course ids exist. They call models instead of writing SQL.",
    location: "backend/services/",
    exampleFile: "user.service.js, course.service.js, auth.service.js",
    connection: "Controller → Service → Model",
    examples: [
      "createUser — trim email, check course ids",
      "login — compare password hash, issue JWT",
    ],
  },
  {
    id: "models",
    title: "Models",
    short: "SQL only",
    purpose:
      "Models communicate with PostgreSQL and handle database queries. This is the only layer that should contain SQL.",
    location: "backend/models/",
    exampleFile: "user.model.js, course.model.js",
    connection: "Service → Model → PostgreSQL",
    examples: [
      "INSERT INTO courses (name, description, price) VALUES ($1, $2, $3)",
      "SELECT * FROM users WHERE id = $1",
    ],
  },
  {
    id: "database",
    title: "PostgreSQL",
    short: "Tables and rows",
    purpose:
      "PostgreSQL stores users, courses, and the user_courses join table. The pool is created once in config/database.js.",
    location: "backend/config/database.js",
    exampleFile: "scripts/schema.sql",
    connection: "Model → PostgreSQL → Response",
    examples: [
      "users (id, name, email, password)",
      "courses (id, name, description, price, created_at)",
      "user_courses (user_id, course_id)",
    ],
  },
];

export const requestFlow = [
  { label: "React Form", detail: "pages/Courses.jsx submits name, description, and price" },
  { label: "POST /api/courses", detail: "api/client.js sends JSON + JWT" },
  { label: "course.routes.js", detail: "Matches POST / and attaches middleware" },
  { label: "validation middleware", detail: "validateCreateCourse checks the body" },
  { label: "auth middleware", detail: "requireAuth verifies the Bearer token" },
  { label: "course.controller.js", detail: "createCourse() reads req.body" },
  { label: "course.service.js", detail: "Trims name and coerces price" },
  { label: "course.model.js", detail: "Parameterized INSERT query" },
  { label: "PostgreSQL", detail: "Inserts a row and returns it" },
  { label: "Response", detail: "201 + { message, course }" },
  { label: "React UI", detail: "Table refreshes, success alert appears" },
];
