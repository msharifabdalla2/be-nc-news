const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const app = require("../app");
require('jest-sorted');

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeInstanceOf(Array);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.img_url).toBe("string");
        });
      });
  });

  test("404: Responds with an error for invalid endpoint", () => {
    return request(app)
      .get("/api/invalid-endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});