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
    test("Unknown url not found", () => {
        return request(app).get("/api/toothpicks").expect(404)
    })
})

describe("GET /api/topics", () => {
  test("Returns a list of all the topics as an array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeInstanceOf(Array)
      })
  })
  test("All returned topic objects have their essential keys", () => {
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
    xtest("Returns object the article matching the input id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          console.log(body)
        })
    })
  })
  
