// Integration tests for every endpoint. Requires the API + MongoDB running.
//   npm run dev        (terminal 1)
//   npm test           (terminal 2)
import test from "node:test";
import assert from "node:assert/strict";

const BASE = process.env.API_URL || "http://localhost:5000/api";
const run = Date.now();
const state = {};

const call = async (method, path, { body, token } = {}) => {
  const res = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, json: await res.json() };
};
const expectStatus = (res, status) => assert.equal(res.status, status, JSON.stringify(res.json));

const register = (name, role) =>
  call("POST", "/auth/register", { body: { name, email: `${role}${name}${run}@test.com`, password: "Password123", role } });

test("Authentication", async (t) => {
  await t.test("register instructor A, instructor B, student A, student B", async () => {
    for (const [key, name, role] of [["insA", "A", "instructor"], ["insB", "B", "instructor"], ["stuA", "A", "student"], ["stuB", "B", "student"]]) {
      const res = await register(name, role);
      expectStatus(res, 201);
      assert.equal(res.json.data.user.password, undefined);
      state[key] = res.json.data.token;
      state[key + "Email"] = `${role}${name}${run}@test.com`;
    }
  });
  await t.test("duplicate email -> 409", async () => expectStatus(await register("A", "student"), 409));
  await t.test("invalid email -> 400", async () =>
    expectStatus(await call("POST", "/auth/register", { body: { name: "x", email: "bad", password: "Password123" } }), 400));
  await t.test("weak password -> 400", async () =>
    expectStatus(await call("POST", "/auth/register", { body: { name: "x", email: "w@test.com", password: "123" } }), 400));
  await t.test("login ok -> 200 with token", async () => {
    const res = await call("POST", "/auth/login", { body: { email: state.stuAEmail, password: "Password123" } });
    expectStatus(res, 200);
    assert.ok(res.json.data.token);
  });
  await t.test("wrong password -> 401", async () =>
    expectStatus(await call("POST", "/auth/login", { body: { email: state.stuAEmail, password: "Wrong123" } }), 401));
  await t.test("GET /auth/me works with token", async () => {
    const res = await call("GET", "/auth/me", { token: state.stuA });
    expectStatus(res, 200);
    assert.equal(res.json.data.user.role, "student");
  });
  await t.test("missing token -> 401", async () => expectStatus(await call("GET", "/auth/me"), 401));
  await t.test("invalid token -> 401", async () => expectStatus(await call("GET", "/auth/me", { token: "abc" }), 401));
});

test("Courses and authorization", async (t) => {
  const course = { title: `JavaScript ${run}`, description: "Learn JS", category: "Programming", price: 10 };
  await t.test("student cannot create course -> 403", async () =>
    expectStatus(await call("POST", "/courses", { body: course, token: state.stuA }), 403));
  await t.test("instructor creates course -> 201 and owns it", async () => {
    const res = await call("POST", "/courses", { body: { ...course, instructor: "000000000000000000000000" }, token: state.insA });
    expectStatus(res, 201);
    state.courseId = res.json.data.course._id;
    assert.notEqual(res.json.data.course.instructor, "000000000000000000000000");
  });
  await t.test("invalid price / missing title -> 400", async () => {
    expectStatus(await call("POST", "/courses", { body: { ...course, price: -5 }, token: state.insA }), 400);
    expectStatus(await call("POST", "/courses", { body: { ...course, title: "" }, token: state.insA }), 400);
  });
  await t.test("list with pagination", async () => {
    const res = await call("GET", "/courses?page=1&limit=2");
    expectStatus(res, 200);
    assert.equal(res.json.data.pagination.limit, 2);
    assert.ok(res.json.data.courses.length <= 2);
  });
  await t.test("search finds course; nonsense returns empty", async () => {
    const found = await call("GET", `/courses?search=${encodeURIComponent("JavaScript " + run)}`);
    assert.ok(found.json.data.courses.length >= 1);
    const none = await call("GET", "/courses?search=zzzzqqqq");
    assert.equal(none.json.data.total ?? none.json.data.pagination.total, 0);
  });
  await t.test("category filter", async () => {
    const res = await call("GET", "/courses?category=Programming");
    assert.ok(res.json.data.courses.every((c) => c.category === "Programming"));
  });
  await t.test("get course; invalid id -> 400; unknown id -> 404", async () => {
    expectStatus(await call("GET", `/courses/${state.courseId}`), 200);
    expectStatus(await call("GET", "/courses/123"), 400);
    expectStatus(await call("GET", "/courses/000000000000000000000000"), 404);
  });
  await t.test("instructor mine + stats", async () => {
    expectStatus(await call("GET", "/courses/instructor/mine", { token: state.insA }), 200);
    expectStatus(await call("GET", `/courses/${state.courseId}/stats`, { token: state.insA }), 200);
    expectStatus(await call("GET", "/courses/instructor/mine", { token: state.stuA }), 403);
  });
  await t.test("owner updates -> 200; other instructor -> 403", async () => {
    const body = { ...course, title: "Updated title" };
    expectStatus(await call("PUT", `/courses/${state.courseId}`, { body, token: state.insA }), 200);
    expectStatus(await call("PUT", `/courses/${state.courseId}`, { body, token: state.insB }), 403);
    expectStatus(await call("DELETE", `/courses/${state.courseId}`, { token: state.insB }), 403);
  });
});

test("Lessons, enrollment, progress", async (t) => {
  await t.test("owner creates lesson; other instructor -> 403", async () => {
    const lesson = { title: "Variables", description: "d", content: "Secret content", order: 1 };
    const res = await call("POST", `/courses/${state.courseId}/lessons`, { body: lesson, token: state.insA });
    expectStatus(res, 201);
    state.lessonId = res.json.data.lesson._id;
    expectStatus(await call("POST", `/courses/${state.courseId}/lessons`, { body: lesson, token: state.insB }), 403);
  });
  await t.test("public lesson list hides content", async () => {
    const res = await call("GET", `/courses/${state.courseId}/lessons`);
    expectStatus(res, 200);
    assert.equal(res.json.data.lessons[0].content, undefined);
  });
  await t.test("non-enrolled student cannot read lesson -> 403", async () =>
    expectStatus(await call("GET", `/lessons/${state.lessonId}`, { token: state.stuA }), 403));
  await t.test("enroll: no token 401, instructor 403, student 201, duplicate 409", async () => {
    expectStatus(await call("POST", `/courses/${state.courseId}/enroll`), 401);
    expectStatus(await call("POST", `/courses/${state.courseId}/enroll`, { token: state.insA }), 403);
    expectStatus(await call("POST", `/courses/${state.courseId}/enroll`, { token: state.stuA }), 201);
    expectStatus(await call("POST", `/courses/${state.courseId}/enroll`, { token: state.stuA }), 409);
  });
  await t.test("enrolled student reads lesson; owner reads; other instructor 403", async () => {
    const res = await call("GET", `/lessons/${state.lessonId}`, { token: state.stuA });
    expectStatus(res, 200);
    assert.equal(res.json.data.lesson.content, "Secret content");
    expectStatus(await call("GET", `/lessons/${state.lessonId}`, { token: state.insA }), 200);
    expectStatus(await call("GET", `/lessons/${state.lessonId}`, { token: state.insB }), 403);
  });
  await t.test("my-courses and enrollment status", async () => {
    const mine = await call("GET", "/enrollments/my-courses", { token: state.stuA });
    expectStatus(mine, 200);
    assert.equal(mine.json.data.enrollments.length, 1);
    const status = await call("GET", `/courses/${state.courseId}/enrollment`, { token: state.stuA });
    assert.equal(status.json.data.enrolled, true);
    const other = await call("GET", `/courses/${state.courseId}/enrollment`, { token: state.stuB });
    assert.equal(other.json.data.enrolled, false);
  });
  await t.test("progress: valid 200, invalid 400, not enrolled 404", async () => {
    expectStatus(await call("PUT", `/courses/${state.courseId}/progress`, { body: { progress: 50 }, token: state.stuA }), 200);
    expectStatus(await call("PUT", `/courses/${state.courseId}/progress`, { body: { progress: 30 }, token: state.stuA }), 400);
    expectStatus(await call("PUT", `/courses/${state.courseId}/progress`, { body: { progress: 50 }, token: state.stuB }), 404);
  });
  await t.test("owner updates lesson; other instructor 403", async () => {
    const body = { title: "Variables v2", description: "d", content: "c" };
    expectStatus(await call("PUT", `/lessons/${state.lessonId}`, { body, token: state.insA }), 200);
    expectStatus(await call("PUT", `/lessons/${state.lessonId}`, { body, token: state.insB }), 403);
  });
});

test("Comments", async (t) => {
  await t.test("not enrolled student cannot comment -> 403", async () =>
    expectStatus(await call("POST", `/lessons/${state.lessonId}/comments`, { body: { content: "hi" }, token: state.stuB }), 403));
  await t.test("empty comment -> 400; valid -> 201", async () => {
    expectStatus(await call("POST", `/lessons/${state.lessonId}/comments`, { body: { content: "   " }, token: state.stuA }), 400);
    const res = await call("POST", `/lessons/${state.lessonId}/comments`, { body: { content: "Great!" }, token: state.stuA });
    expectStatus(res, 201);
    state.commentId = res.json.data.comment._id;
  });
  await t.test("get comments", async () => {
    const res = await call("GET", `/lessons/${state.lessonId}/comments`, { token: state.stuA });
    expectStatus(res, 200);
    assert.equal(res.json.data.comments.length, 1);
  });
  await t.test("another student cannot edit/delete -> 403", async () => {
    expectStatus(await call("PUT", `/comments/${state.commentId}`, { body: { content: "hack" }, token: state.stuB }), 403);
    expectStatus(await call("DELETE", `/comments/${state.commentId}`, { token: state.stuB }), 403);
  });
  await t.test("owner edits and deletes", async () => {
    expectStatus(await call("PUT", `/comments/${state.commentId}`, { body: { content: "Edited" }, token: state.stuA }), 200);
    expectStatus(await call("DELETE", `/comments/${state.commentId}`, { token: state.stuA }), 200);
  });
});

test("Cleanup", async (t) => {
  await t.test("delete lesson, then course", async () => {
    expectStatus(await call("DELETE", `/lessons/${state.lessonId}`, { token: state.insA }), 200);
    expectStatus(await call("DELETE", `/courses/${state.courseId}`, { token: state.insA }), 200);
    expectStatus(await call("GET", `/courses/${state.courseId}`), 404);
  });
});
