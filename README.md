# Online Course Platform

A full-stack MERN-style web application where **students** browse, enroll in and complete courses, and **instructors** create and manage their own courses and lessons.

## Features

**Everyone**: register / log in (JWT), browse courses with search, category filter and pagination, view course details and lesson outline.

**Students**: enroll (no duplicates), "My Courses" with progress, learning page, lesson content and video (only if enrolled), progress tracking (0/25/50/75/100%), comments on lessons (edit/delete own), profile, dashboard.

**Instructors**: create / edit / delete own courses, create / edit / delete lessons of own courses, per-course statistics (lessons, students, completions, average progress), dashboard.

**Platform**: bcrypt password hashing, role-based access control, ownership checks on the backend, request validation, ObjectId validation, centralized error handling, consistent JSON responses.

## Technologies

| Backend | Frontend |
|---|---|
| Node.js, Express.js (ES Modules) | React (Create React App) |
| MongoDB + Mongoose | React Router v6 |
| JWT (jsonwebtoken), bcryptjs | Axios, Context API |
| express-validator, dotenv, cors | Plain CSS |

## Architecture

```text
Frontend (React)
   ↓
Axios (services/api.js, attaches JWT)
   ↓
REST API
   ↓
Express (routes → middleware → validators)
   ↓
Controllers
   ↓
Mongoose models
   ↓
MongoDB
```

## Models

- **User**: name, email (unique, lowercase), password (hashed, `select: false`), role (`student` | `instructor`), timestamps.
- **Course**: title, description, instructor → User, category, image, price, timestamps.
- **Lesson**: title, description, content, videoUrl, course → Course, order, timestamps.
- **Enrollment**: student → User, course → Course, enrolledAt, progress (0/25/50/75/100). Unique compound index (student, course).
- **Comment**: student → User, lesson → Lesson, content, timestamps.

## Authentication

1. `POST /api/auth/register` or `/login` returns a signed JWT (`JWT_SECRET`, `JWT_EXPIRES_IN`).
2. The frontend stores the token in `localStorage`; the Axios interceptor sends `Authorization: Bearer <token>`.
3. `requireAuth` verifies the token, loads the user and sets `req.user` (401 for missing / invalid / expired token or deleted user).
4. On refresh the `AuthContext` calls `GET /api/auth/me` to restore the session.

## Authorization

| Action | Student | Instructor |
|---|---|---|
| Browse courses, view lesson outline | ✅ | ✅ |
| Create / edit / delete courses | ❌ 403 | ✅ own only |
| Create / edit / delete lessons | ❌ 403 | ✅ own course only |
| Read lesson content | ✅ if enrolled | ✅ own course only |
| Enroll, progress | ✅ | ❌ 403 |
| Comments | ✅ enrolled, own only to edit/delete | ❌ 403 |

`requireRole("student" | "instructor")` handles roles; ownership is checked inside controllers/helpers (`utils/courseAccess.js`). The user id and role always come from `req.user`, never from the request body.

## Project Structure

```text
online-course-platform/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/   auth, course, lesson, enrollment, comment
│   │   ├── middleware/    auth, role, validation, error
│   │   ├── models/        User, Course, Lesson, Enrollment, Comment
│   │   ├── routes/        auth, course, lesson, enrollment, comment
│   │   ├── validators/    auth, course, lesson, comment, enrollment, common
│   │   ├── utils/         generateToken, AppError, asyncHandler, sendResponse, courseAccess
│   │   ├── app.js
│   │   ├── server.js
│   │   └── seed.js
│   ├── .env  .env.example  .gitignore  package.json  README.md
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── components/    Navbar, Footer, CourseCard, CourseForm, LessonForm, ProgressBar,
│   │   │                  ProtectedRoute, RoleRoute, Loading, ErrorMessage
│   │   ├── pages/public/      Home, Courses, CourseDetails, Login, Register
│   │   ├── pages/student/     StudentDashboard, MyCourses, LearningPage, LessonDetails, Profile
│   │   ├── pages/instructor/  InstructorDashboard, InstructorCourses, CreateCourse, EditCourse,
│   │   │                      CourseLessons, CreateLesson, EditLesson
│   │   ├── layouts/       MainLayout, StudentLayout, InstructorLayout
│   │   ├── services/      api, auth, course, lesson, enrollment, comment
│   │   ├── context/AuthContext.js
│   │   ├── hooks/useAuth.js
│   │   ├── utils/         storage, constants, helpers
│   │   ├── App.js  index.js  index.css
│   ├── .env  .gitignore  package.json  README.md
├── postman/               collection + environment
└── README.md
```

## Installation

Prerequisites: Node.js 18+, MongoDB (local or Atlas).

### MongoDB

- **Local**: install MongoDB Community Server and start the service (`mongod`, or `brew services start mongodb-community`, or `sudo systemctl start mongod`). Default URI: `mongodb://localhost:27017/online-course-platform` (the database is created automatically).
- **Atlas**: create a free cluster, add a database user, allow your IP, and copy the connection string into `MONGODB_URI`.

### Backend

```bash
cd backend
npm install express mongoose jsonwebtoken bcryptjs express-validator dotenv cors
npm install -D nodemon
# (or simply: npm install — package.json already lists everything)
```

### Frontend

The frontend uses the standard Create React App structure. Two options:

```bash
# Option A — use the provided package.json
cd frontend
npm install

# Option B — start from a fresh CRA project and copy the provided src/ and public/index.html
npx create-react-app frontend
cd frontend
npm install axios react-router-dom
```

## Environment Variables

`backend/.env` (copy from `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/online-course-platform
JWT_SECRET=use_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

`frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Never commit real secrets. `.env` is git-ignored; `.env.example` lists only names.
Generate a secret with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

## Running

```bash
# Terminal 1 — backend (http://localhost:5000)
cd backend
npm run dev          # or: npm start
npm run seed         # optional demo data (wipes the database!)

# Terminal 2 — frontend (http://localhost:3000)
cd frontend
npm start
```

Seed accounts (password `Password123`): `instructor@example.com`, `student@example.com`.

### Static (predefined) courses

The course catalog lives in `backend/src/data/courses.js`: 13 courses with lessons across all 6 categories. Edit that file to change or add courses.

```bash
cd backend
npm run seed:courses   # safe: keeps your data, adds only missing courses
npm run seed           # full reset: wipes the database, then adds demo users + courses
```

## API Endpoints

All responses: `{ "success": true|false, "message": "...", "data": {...} }`.

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | public |
| POST | `/api/auth/login` | public |
| GET | `/api/auth/me` | any logged-in user |

### Courses
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/courses?page=&limit=&search=&category=` | public |
| GET | `/api/courses/:id` | public |
| POST | `/api/courses` | instructor |
| PUT | `/api/courses/:id` | owner instructor |
| DELETE | `/api/courses/:id` | owner instructor (also deletes lessons, comments, enrollments) |
| GET | `/api/courses/instructor/mine` | instructor (own courses + counts) |
| GET | `/api/courses/:id/stats` | owner instructor |

### Lessons
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/courses/:courseId/lessons` | public outline (title, description, order) |
| GET | `/api/lessons/:id` | enrolled student or owner instructor (full content) |
| POST | `/api/courses/:courseId/lessons` | owner instructor |
| PUT | `/api/lessons/:id` | owner instructor |
| DELETE | `/api/lessons/:id` | owner instructor |

### Enrollments (students only)
| Method | Endpoint | Notes |
|---|---|---|
| POST | `/api/courses/:courseId/enroll` | 409 if already enrolled |
| GET | `/api/enrollments/my-courses` | |
| GET | `/api/courses/:courseId/enrollment` | returns `{ enrolled, enrollment }` |
| PUT | `/api/courses/:courseId/progress` | body `{ "progress": 0|25|50|75|100 }` |

### Comments (students only)
| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/lessons/:lessonId/comments` | must be enrolled |
| POST | `/api/lessons/:lessonId/comments` | must be enrolled |
| PUT | `/api/comments/:id` | own comment only |
| DELETE | `/api/comments/:id` | own comment only |

Categories: Web Development, Machine Learning, Data Science, Programming, Database, Cyber Security.

## Testing with Postman

1. Import `postman/OnlineCoursePlatform.postman_collection.json` (and optionally the environment file; select it).
2. Variables: `baseUrl`, `token`, `courseId`, `lessonId`, `commentId`.
3. **Login Student / Login Instructor** automatically save the returned token into `token` (test script). If you prefer manual: copy `data.token` from the response into the `token` variable.
4. `Create Course`, `Create Lesson`, `Get Courses`, `Add Comment` also save `courseId`, `lessonId`, `commentId`.
5. Authenticated requests already send `Authorization: Bearer {{token}}`.

Recommended order: Register Instructor → Login Instructor → Create Course → Create Lesson → Register Student → Login Student → Enroll → Get Lesson → Add Comment → Update Progress.

## Automated API tests

`backend/tests/api.test.js` calls every endpoint (auth, courses, lessons, enrollments, comments) and checks the expected status codes, including 401/403/404/409 cases.

```bash
cd backend
npm run dev     # terminal 1 (MongoDB must be running)
npm test        # terminal 2
```

In Postman, run the collection with the Collection Runner: each request has status assertions. Run the instructor login first, then the student requests, as described in the collection description.

## Test Scenarios

**Authentication**
- Register with new email → 201. Same email again → 409. `email: "abc"` → 400. `password: "123"` → 400.
- Login correct → 200 + token. Wrong password → 401.
- `GET /auth/me` with no header → 401; with `Bearer abc` → 401.

**Authorization**
- Student `POST /courses` → 403. Instructor `POST /courses` → 201.
- Instructor A `PUT /courses/:id` (own) → 200. Instructor B same request → 403.
- Student `GET /courses/instructor/mine` → 403.

**Enrollment**
- Student enrolls → 201; again → 409; no token → 401; instructor → 403.

**Lessons**
- Owner creates lesson → 201. Other instructor → 403.
- Enrolled student `GET /lessons/:id` → 200. Non-enrolled student → 403.

**Comments**
- Enrolled student adds → 201; edits own → 200; deletes own → 200.
- Another student edits / deletes it → 403.

**Validation**
- `/courses/123` → 400 (invalid id). Missing title → 400. `progress: 30` → 400. `price: -5` or `"abc"` → 400.

**Courses**
- `?page=2&limit=3` returns pagination metadata; `?search=javascript`; `?category=Database`; `?search=zzzz` returns an empty array with `total: 0`.

## Common Errors

| Problem | Fix |
|---|---|
| **MongoDB connection error** (`ECONNREFUSED`) | Start the MongoDB service; verify `MONGODB_URI` (host, port 27017, database name); for Atlas check the user/password, IP allow-list and URL-encode special characters in the password. |
| **CORS error** in browser | `CLIENT_URL` in `backend/.env` must exactly match the frontend origin (`http://localhost:3000`, no trailing slash). Restart the backend. |
| **JWT errors** (`Invalid token`, `Token has expired`) | Check the `Authorization: Bearer <token>` header (note the space), that `JWT_SECRET` did not change since the token was issued, and that the token has not expired (`JWT_EXPIRES_IN`). Log in again. |
| **React cannot reach the API** | Check `REACT_APP_API_URL=http://localhost:5000/api` in `frontend/.env`; restart `npm start` after editing; make sure the backend is running. |
| **Port already in use** (`EADDRINUSE`) | Change `PORT` in `backend/.env` (and `REACT_APP_API_URL` to match), or stop the process using the port. |
| **Create React App issues** | Use `npx create-react-app frontend` (not Vite). Delete `node_modules` and `package-lock.json`, then `npm install`. Use Node 18+. |
| `JWT_SECRET is not defined` | `backend/.env` is missing or not in the `backend/` folder. |

## Git / GitHub Workflow

```bash
git init
git add . && git commit -m "Initialize project"
# then commit step by step as you work, for example:
#   Setup Express server · Connect MongoDB · Create User model · Implement authentication
#   Add JWT middleware · Add role authorization · Create Course API · Create Lesson API
#   Create Enrollment API · Create Comment API · Setup React application
#   Add authentication context · Add public pages · Add student pages · Add instructor pages
#   Add course management · Add lesson management · Add styling · Add documentation
git branch -M main
git remote add origin https://github.com/<your-user>/online-course-platform.git
git push -u origin main
```

Make sure `.env` files are not committed (they are listed in `.gitignore`). Commit messages above are suggestions; no commits are created for you.
