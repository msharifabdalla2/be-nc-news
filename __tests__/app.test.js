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
        expect(body.topics.length).toBe(3);
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

describe("GET /api/articles/:article_id", () => {
  test("Status: 200, Responds with a article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        })
      })
  })

  test("Status: 400, Responds with an error message when given an id with an invalid data type", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      })
  })

  test("Status: 404, Responds with an error message when given a valid id that does not exist in the database", () => {
    const article_id = 9999999;
    return request(app)
      .get("/api/articles/9999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`No article found for article_id: ${article_id}`);
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects, each containing the necessary properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(article.body).toBeUndefined();
        })
    })
  })

  test("404: Responds with 'Not Found' when no articles exist", () => {
    return request(app)
      .get("/api/incorrectArticless")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
})

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for a valid article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id", 1);
        });
      });
  });

  test("200: Responds with an empty array if an article has no comments", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      })
  });

  test("404: Responds with 'No article found' for a non-existent article_id", () => {
    const article_id = 99999;
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`No article found for article_id: ${article_id}`)
      });
  });

  test("400: Responds with 'Invalid article_id' for a non-numeric article_id", () => {
    return request(app)
      .get("/api/articles/notanumber/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the newly posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment."
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toHaveProperty("comment_id");
        expect(body.comment).toHaveProperty("article_id", 1);
        expect(body.comment).toHaveProperty("author", "butter_bridge");
        expect(body.comment).toHaveProperty("body", "This is a test comment.");
        expect(body.comment).toHaveProperty("votes", 0);
        expect(body.comment).toHaveProperty("created_at");
      });
  });

  test("400: Responds with an error when body is missing", () => {

    const invalidComment = {
      username: "butter_bridge"
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(invalidComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields");
      });
  });

  test("400: Responds with an error when username is missing", () => {
    const invalidComment = { body: "This is a test comment." };

    return request(app)
      .post("/api/articles/1/comments")
      .send(invalidComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields");
      });
  });

  test("400: Responds with an error when article_id is invalid", () => {
    const newComment = { username: "butter_bridge", body: "Test comment" };

    return request(app)
      .post("/api/articles/not-a-number/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });

  test("404: Responds with an error when article_id does not exist", () => {
    const newComment = { username: "butter_bridge", body: "Test comment" };
    const article_id = 99999;

    return request(app)
      .post("/api/articles/99999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`No article found for article_id: ${article_id}`);
      });
  });

  test("404: Responds with an error when username does not exist", () => {
    const newComment = { username: "nonexistent_user", body: "Test comment" };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username not found");
      });
  });
})

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the updated article based on article_id", () => {
    const voteChange = { inc_votes: -150 };

    return request(app)
      .patch("/api/articles/1")
      .send(voteChange)
      .expect(202)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id", 1);
        expect(body.article).toHaveProperty("votes", -50);
      });
  });

  test("400: Responds with an error if inc_votes is not a number", () => {
    const invalidVoteChange = { inc_votes: "invalid" };

    return request(app)
      .patch("/api/articles/1")
      .send(invalidVoteChange)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input, inc_votes must be a number");
      });
  });

  test("400: Responds with an error if article_id is invalid in its type", () => {
    const voteChange = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/notAnId")
      .send(voteChange)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  })

  test("400: Responds with an error if inc_votes is missing from patch object", () => {
    const voteChange = {};

    return request(app)
      .patch("/api/articles/1")
      .send(voteChange)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input, inc_votes must be a number")
      });
  });

  test("404: Responds with an error if article_id is not found", () => {
    const voteChange = { inc_votes: 1 };
    const article_id = 9999;

    return request(app)
      .patch("/api/articles/9999")
      .send(voteChange)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`No article found for article_id: ${article_id}`)
      });
  });
})

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with status 204 and no content when comment is deleted", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204);
  });

  test("404: Responds with error message when comment_id is not found", () => {
    const comment_id = 999;

    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`No comment found for comment_id: ${comment_id}`)
      });
  });

  test("400: Responds with 'Invalid ID' when given an invalid commentId in the endpoint", () => {
    return request(app)
      .delete("/api/comments/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });
})

describe("GET /api/users", () => {
  test("200: Responds with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("GET /api/articles (sorting queries)", () => {
  test("200: Responds with articles sorted by created_at in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });

  test("200: Responds with articles sorted by any valid column", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { descending: true });
      });
  });

  test("200: Accepts an order query to sort in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: false
        });
      });
  });

  test("400: Responds with error when given an invalid sort_by column", () => {
    return request(app)
      .get("/api/articles?sort_by=not_a_column")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort_by query")
      });
  });

  test("400: Responds with error when given an invalid order value", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=wrong_order")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query");
      });
  });
  test("400: Responds with error when given an invalid order and sort_by value", () => {
    return request(app)
      .get("/api/articles?sort_by=wrong_column&order=wrong_order")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort_by and order query");
      });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("200: Responds with articles filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles.length).toBe(1);
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("topic", "cats");
        });
      });
  });

  test("404: Responds with an error if topic does not exist", () => {
    const topic = "invalidTopic";

    return request(app)
      .get("/api/articles?topic=invalidTopic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`No topic found for topic: ${topic}`);
      });
  });
});
