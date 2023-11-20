const data = require("../../db/data/test-data")
const app = require("../../app")
const db = require("../../db/connection")
const seed = require("../../db/seeds/seed")
const request = require("supertest")

beforeEach(() => seed(data))

afterAll(() => {
  db.end()
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
            expect(body.endpoints[endpoint].description).toEqual(expect.any(String))
            expect(body.endpoints[endpoint].queries).toEqual(expect.any(Array))
            expect(body.endpoints[endpoint].exampleResponse).toEqual(expect.any(Object))
            expect(body.endpoints[endpoint].exampleRequest).toEqual(expect.any(Object))
        }
      })
  })
})

