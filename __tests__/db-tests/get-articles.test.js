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
    test("Returns object the article matching the input id", () => {

    })
})

describe("errors", () => {

})