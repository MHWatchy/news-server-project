const data = require("../../db/data/test-data")
const app = require("../../app")
const db = require("../../db/connection")
const seed = require("../../db/seeds/seed")
const request = require("supertest")

beforeEach(() => seed(data))

afterAll(() => {
  db.end()
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

describe("errors", () => {})
