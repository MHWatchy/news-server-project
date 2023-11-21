const data = require("../db/data/test-data")
const app = require("../app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const request = require("supertest")

beforeEach(() => seed(data))

afterAll(() => db.end())

describe("Errors", () => {
  test("404: Unknown url not found", () => {
    return request(app)
      .get("/api/toothpicks")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found")
      })
  })
})

describe("GET /api", () => {
  test("Returns an object containing all api endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toBeInstanceOf(Object)
      })
  })
  test("Endpoint objects should feature keys for description, queries, request body, and response example", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        for (const endpoint in body.endpoints) {
          expect(body.endpoints[endpoint].description).toEqual(
            expect.any(String)
          )
          expect(body.endpoints[endpoint].queries).toEqual(expect.any(Array))
          expect(body.endpoints[endpoint].exampleResponse).toEqual(
            expect.any(Object)
          )
          expect(body.endpoints[endpoint].exampleRequest).toEqual(
            expect.any(Object)
          )
        }
      })
  })
})

describe("GET /api/topics", () => {
  test("200: Returns a list of all the topics as an array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeInstanceOf(Array)
      })
  })
  test("200: All returned topic objects have their essential keys", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3)
        body.topics.forEach((topic) => {
          expect(topic).toBeInstanceOf(Object)
          expect(topic.description).toEqual(expect.any(String))
          expect(topic.slug).toEqual(expect.any(String))
        })
      })
  })
})

describe("GET /api/articles", () => {
  test("200: Returned articles are in an array", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array)
      })
  })
  test("200: Returned articles possess the keys they are meant to", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBeGreaterThan(0)
        body.articles.forEach((article) => {
          expect(article.article_id).toEqual(expect.any(Number))
          expect(article.title).toEqual(expect.any(String))
          expect(article.topic).toEqual(expect.any(String))
          expect(article.author).toEqual(expect.any(String))
          expect(article.created_at).toEqual(expect.any(String))
          expect(article.votes).toEqual(expect.any(Number))
          expect(article.article_img_url).toEqual(expect.any(String))
          expect(article.comment_count).toEqual(expect.any(String))
        })
      })
  })
  test("200: Returned articles should not possess a body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBeGreaterThan(0)
        body.articles.forEach((article) => {
          expect(article).not.toHaveProperty("body")
        })
      })
  })
  test("200: Articles are sorted by date in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true })
      })
  })
})

describe("GET /api/articles/:article_id", () => {
  test("200: Returned article matches the input id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1)
      })
  })
  test("200: Returned article features the correct keys", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toEqual(expect.any(Number))
        expect(body.article.title).toEqual(expect.any(String))
        expect(body.article.topic).toEqual(expect.any(String))
        expect(body.article.author).toEqual(expect.any(String))
        expect(body.article.body).toEqual(expect.any(String))
        expect(body.article.created_at).toEqual(expect.any(String))
        expect(body.article.votes).toEqual(expect.any(Number))
        expect(body.article.article_img_url).toEqual(expect.any(String))
      })
  })
  test("400: Bad request when id param is not a number", () => {
    return request(app)
      .get("/api/articles/vangogh")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("404: Valid id number does not have an article", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found")
      })
  })
})

describe("/api/articles/:article_id/comments", () => {
  test("200: Returns with an array of comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array)
      })
  })
  test("200: Comments possess their required keys, implying they are of the correct article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11)
        body.comments.forEach((comment) => {
          expect(comment.comment_id).toEqual(expect.any(Number))
          expect(comment.votes).toEqual(expect.any(Number))
          expect(comment.created_at).toEqual(expect.any(String))
          expect(comment.author).toEqual(expect.any(String))
          expect(comment.body).toEqual(expect.any(String))
          expect(comment.article_id).toBe(1)
        })
      })
  })
  test("200: Comments default to being ordered by most recent first (date descending)", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true })
      })
  })
  test("400: Bad request id parameter is not a number", () => {
    return request(app)
      .get("/api/articles/won/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("404: Id parameter is a valid id but that article doesn't exist", () => {
    return request(app)
      .get("/api/articles/7002/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found")
      })
  })
  test("200: Article exists but has no comments on it", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([])
      })
  })
})
