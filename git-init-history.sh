#!/usr/bin/env bash
# Creates a meaningful commit history from the finished project.
# Run once from the project root:  bash git-init-history.sh
set -e
git init -b main
c() { msg="$1"; shift; git add "$@" 2>/dev/null || true; git diff --cached --quiet || git commit -q -m "$msg"; }

c "Initialize project" .gitignore README.md
c "Setup Express server" backend/package.json backend/package-lock.json backend/.gitignore backend/.env.example backend/src/app.js backend/src/server.js
c "Connect MongoDB" backend/src/config
c "Create User model" backend/src/models/User.js
c "Create Course, Lesson, Enrollment and Comment models" backend/src/models
c "Add utilities and centralized error handling" backend/src/utils backend/src/middleware/errorMiddleware.js
c "Implement authentication" backend/src/controllers/authController.js backend/src/routes/authRoutes.js backend/src/validators/authValidator.js backend/src/validators/commonValidator.js backend/src/middleware/validationMiddleware.js
c "Add JWT middleware" backend/src/middleware/authMiddleware.js
c "Add role authorization" backend/src/middleware/roleMiddleware.js
c "Create Course API" backend/src/controllers/courseController.js backend/src/routes/courseRoutes.js backend/src/validators/courseValidator.js
c "Create Lesson API" backend/src/controllers/lessonController.js backend/src/routes/lessonRoutes.js backend/src/validators/lessonValidator.js
c "Create Enrollment API" backend/src/controllers/enrollmentController.js backend/src/routes/enrollmentRoutes.js backend/src/validators/enrollmentValidator.js
c "Create Comment API" backend/src/controllers/commentController.js backend/src/routes/commentRoutes.js backend/src/validators/commentValidator.js
c "Add database seed script" backend/src/seed.js
c "Add API integration tests" backend/tests
c "Add Postman collection" postman
c "Setup React application" frontend/package.json frontend/package-lock.json frontend/.gitignore frontend/.env.example frontend/public frontend/src/index.js
c "Add API services and utilities" frontend/src/services frontend/src/utils
c "Add authentication context" frontend/src/context frontend/src/hooks
c "Add shared components and layouts" frontend/src/components frontend/src/layouts frontend/src/App.js
c "Add public pages" frontend/src/pages/public
c "Add student pages" frontend/src/pages/student
c "Add instructor pages" frontend/src/pages/instructor
c "Add styling" frontend/src/index.css
c "Add documentation" backend/README.md frontend/README.md
git add -A && (git diff --cached --quiet || git commit -q -m "Final cleanup")
git log --oneline
echo "Now: git remote add origin https://github.com/<you>/online-course-platform.git && git push -u origin main"
