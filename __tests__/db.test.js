const data = require("../db/data/test-data")
const app = require("../app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const request = require("supertest")

beforeEach(() => seed(data))

afterAll(() => {
  db.end()
})

describe("Errors", () => {
  test("404: Unknown url not found", () => {
    return request(app).get("/api/toothpicks").expect(404)
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

describe("GET /api/articles:id", () => {
  test("200: Returned article matches the input id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        console.log(body)
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
