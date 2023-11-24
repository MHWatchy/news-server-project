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
  test("200: Returns an object containing all api endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toBeInstanceOf(Object)
      })
  })
  test("200: Endpoint objects should feature keys for description, queries, request body, and response example", () => {
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
  test("200: Articles can be queried by topic to filter results", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(1)
        body.articles.forEach((article) => {
          expect(article.topic).toBe("cats")
        })
      })
  })
  test("404: Topic query is not in topic database", () => {
    return request(app)
      .get("/api/articles?topic=bears")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found")
      })
  })
  test("200: Returns empty array when there are no articles for the valid topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([])
      })
  })
  test("200: Accepts an order query to order the articles in asc order", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { ascending: true })
      })
  })
  test("400: Returns an error if user inputs an invalid order", () => {
    return request(app)
      .get("/api/articles?order=thebest")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order")
      })
  })
  test("200: Accepts a sort_by query to order the articles by title", () => {
    return request(app)
      .get("/api/articles?sortby=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { descending: true })
      })
  })
  test("200: Accepts a sort_by query to order the articles by topic", () => {
    return request(app)
      .get("/api/articles?sortby=topic")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("topic", { descending: true })
      })
  })
  test("200: Accepts a sort_by query to order the articles by author", () => {
    return request(app)
      .get("/api/articles?sortby=author")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author", { descending: true })
      })
  })
  test("200: Accepts a sort_by query to order the articles by created_at", () => {
    return request(app)
      .get("/api/articles?sortby=created_at")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true })
      })
  })
  test("200: Accepts a sort_by query to order the articles by votes", () => {
    return request(app)
      .get("/api/articles?sortby=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes", { descending: true })
      })
  })
  test("400: Returns an error if user inputs an invalid sortby", () => {
    return request(app)
      .get("/api/articles?sortby=controversial")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid topic")
      })
  })
  test("200: Accepts a limit query to limit the amount of articles on a page", () => {
    return request(app)
      .get("/api/articles?limit=5")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(5)
      })
  })
  test("200: Default limit query is set to 10", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10)
      })
  })
  test("200: Accepts a p (page) query to determine which page to return", () => {
    return request(app)
      .get("/api/articles?sortby=article_id&p=2&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(3)
        expect(body.articles[0].article_id).toBe(11)
      })
  })
  test("400: Returns an error if limit is the wrong data type", () => {
    return request(app)
      .get("/api/articles?limit=some")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("400: Returns an error if p (page) is the wrong data type", () => {
    return request(app)
      .get("/api/articles?p=acouplein")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("200: Returns an empty array if p (page) is a valid data type but doesn't have any content", () => {
    return request(app)
      .get("/api/articles?p=3")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([])
      })
  })
  test("200: Returns an additional value for total articles disregarding limit", () => {
    return request(app)
      .get("/api/articles?limit=5")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].total_count).toBe(13)
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
        expect(body.msg).toBe("Id not found")
      })
  })
  test("200: Articles also feature a comment_count value", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.comment_count).toBe(11)
      })
  })
})

describe("GET /api/articles/:article_id/comments", () => {
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
      .get("/api/articles/1/comments?limit=20")
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
        expect(body.msg).toBe("Id not found")
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
  test("200: Accepts a limit query to limit the amount of comments on a page", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(5)
      })
  })
  test("200: Default limit query is set to 10", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(10)
      })
  })
  test("200: Accepts a p (page) query to determine which page to return", () => {
    return request(app)
      .get("/api/articles/1/comments?p=2&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(1)
        expect(body.comments[0].comment_id).toBe(9)
      })
  })
  test("400: Returns an error if limit is the wrong data type", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=some")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("400: Returns an error if p (page) is the wrong data type", () => {
    return request(app)
      .get("/api/articles/1/comments?p=acouplein")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("200: Returns an empty array if p (page) is a valid data type but doesn't have any content", () => {
    return request(app)
      .get("/api/articles/1/comments?p=3")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([])
      })
  })
})

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Returns the posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is truly a mind-blowing experience",
    }
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.comment_id).toBe(19)
        expect(body.comment.body).toBe(
          "This is truly a mind-blowing experience"
        )
        expect(body.comment.votes).toBe(0)
        expect(body.comment.author).toBe("butter_bridge")
        expect(body.comment.article_id).toBe(2)
        expect(body.comment.created_at).toEqual(expect.any(String))
      })
  })
  test("404: Returns an error if a valid id is entered but there is no article", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is truly a mind-blowing experience",
    }
    return request(app)
      .post("/api/articles/7002/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Id not found")
      })
  })
  test("400: Returns an error if an invalid id type is entered", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is truly a mind-blowing experience",
    }
    return request(app)
      .post("/api/articles/threehundredandtwo/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("400: Returns an error when input object is missing values", () => {
    const newComment = {
      username: "butter_bridge",
    }
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("400: Returns an error when input object values are the wrong data types", () => {
    const newComment = {
      username: "butter_bridge",
      body: 8,
    }
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("201: No error when too many keys are provided in the object given that the required keys are present", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is truly a mind-blowing experience",
      age: 1987,
    }
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.comment_id).toBe(19)
        expect(body.comment.body).toBe(
          "This is truly a mind-blowing experience"
        )
        expect(body.comment.votes).toEqual(expect.any(Number))
        expect(body.comment.author).toBe("butter_bridge")
        expect(body.comment.article_id).toBe(2)
        expect(body.comment.created_at).toEqual(expect.any(String))
      })
  })
  test("400: Errors out when the wrong keys are given without the required keys present", () => {
    const newComment = {
      username: "butter_bridge",
      age: 1987,
    }
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("404: returns an error when username passed can't be found", () => {
    const newComment = {
      username: "John Real Kennedy",
      body: "This is truly a mind-blowing experience",
    }
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username not found")
      })
  })
})

describe("GET /api/users", () => {
  test("200: Returns an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4)
        expect(body.users).toBeInstanceOf(Array)
        body.users.forEach((user) => {
          expect(user).toBeInstanceOf(Object)
        })
      })
  })
  test("200: Returned user objects all possess their required keys", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4)
        body.users.forEach((user) => {
          expect(user.username).toEqual(expect.any(String))
          expect(user.name).toEqual(expect.any(String))
          expect(user.avatar_url).toEqual(expect.any(String))
        })
      })
  })
})

describe("PATCH /api/articles/:article_id", () => {
  test("200: Updates article by the determined increment of votes", () => {
    const input = { inc_votes: 10 }
    return request(app)
      .patch("/api/articles/3")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(10)
      })
  })
  test("404: Errors out when id type is valid but no articles with that id can be found", () => {
    const input = { inc_votes: 10 }
    return request(app)
      .patch("/api/articles/34568")
      .send(input)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Id not found")
      })
  })
  test("400: Errors out when id type is invalid", () => {
    const input = { inc_votes: 10 }
    return request(app)
      .patch("/api/articles/thatoneabouttheguy")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("400: Return bad request when object does not contain required key", () => {
    const input = { votes_to_add_by: 10 }
    return request(app)
      .patch("/api/articles/2")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("200: Accepts input object with unnecessary keys given that the required one is present", () => {
    const input = { inc_votes: 10, somebody: "once", told: "me" }
    return request(app)
      .patch("/api/articles/2")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(10)
      })
  })
  test("400: Return bad request when required key is the wrong data type", () => {
    const input = { inc_votes: "the world is gonna roll me" }
    return request(app)
      .patch("/api/articles/2")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("200: Returns a vote count decremented", () => {
    const input = { inc_votes: -10 }
    return request(app)
      .patch("/api/articles/2")
      .send(input)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(-10)
      })
  })
})

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Comment id deleted", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(({ body }) => {
        expect(body.msg).toBe(undefined)
      })
  })
  test("404: Returns error when a valid id cannot be found", () => {
    return request(app)
      .delete("/api/comments/4768")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Id not found")
      })
  })
  test("400: Returns error when a invalid id type is input", () => {
    return request(app)
      .delete("/api/comments/thethingidisagreewith")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
})

describe("GET /api/users/:username", () => {
  test("200: Returns with the user object with the matching username", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual({
          username: "rogersop",
          name: "paul",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
        })
      })
  })
  test("404: Returns an error when a username cannot be found", () => {
    return request(app)
      .get("/api/users/dvaardtehr")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found")
      })
  })
})

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Returns with the comment with an updated votes value", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.votes).toBe(15)
      })
  })
  test("404: Errors out when a valid id has no associated comment", () => {
    return request(app)
      .patch("/api/comments/96")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Id not found")
      })
  })
  test("400: Errors out when an invalid id is input", () => {
    return request(app)
      .patch("/api/comments/real")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("400: Bad request when required key is not provided", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ more_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("200: Accepts inputs with unnecessary keys given the required key is present", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ inc_votes: 1, i: "ain't", the: "sharpest" })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.votes).toBe(15)
      })
  })
  test("400: Bad request when required key is the wrong data type", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ inc_votes: "unless" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("200: Can decrement votes as well", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ inc_votes: -1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.votes).toBe(13)
      })
  })
})

describe("POST /api/articles", () => {
  test("201: Returns with the new article", () => {
    const newArticle = {
      author: "rogersop",
      title: "Top 10 little guys",
      body: "Numbers 10 through 2 are empty because every entry was number 1.",
      topic: "cats",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    }
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article.author).toBe("rogersop")
        expect(body.article.title).toBe("Top 10 little guys")
        expect(body.article.body).toBe(
          "Numbers 10 through 2 are empty because every entry was number 1."
        )
        expect(body.article.topic).toBe("cats")
        expect(body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        )
        expect(body.article.article_id).toBe(14)
        expect(body.article.votes).toBe(0)
        expect(body.article.created_at).toEqual(expect.any(String))
        expect(body.article.comment_count).toBe(0)
      })
  })
  test("404: Returns an error when author doesn't exist", () => {
    const newArticle = {
      author: "the_goobler_woobler",
      title: "Top 10 little guys",
      body: "Numbers 10 through 2 are empty because every entry was number 1.",
      topic: "cats",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    }
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username not found")
      })
  })
  test("400: Returns an error when title is missing", () => {
    const newArticle = {
      author: "rogersop",
      body: "Numbers 10 through 2 are empty because every entry was number 1.",
      topic: "cats",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    }
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("400: Returns an error when body is missing", () => {
    const newArticle = {
      author: "rogersop",
      title: "Top 10 little guys",
      topic: "cats",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    }
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("404: Returns an error when topic doesn't exist", () => {
    const newArticle = {
      author: "rogersop",
      title: "Top 10 little guys",
      body: "Numbers 10 through 2 are empty because every entry was number 1.",
      topic: "smollen",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    }
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found")
      })
  })
  test("201: Returns an article with default article_img_url if that key is missing", () => {
    const newArticle = {
      author: "rogersop",
      title: "Top 10 little guys",
      body: "Numbers 10 through 2 are empty because every entry was number 1.",
      topic: "cats",
    }
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
        )
      })
  })
})

describe("POST /api/topics", () => {
  test("201: Returns the newly created topic object", () => {
    const newTopic = {
      slug: "fog",
      description: "The fog is coming",
    }
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        expect(body.topic).toEqual({
          description: "The fog is coming",
          slug: "fog"
        })
      })
  })
  test("400: Returns an error if topic already exists", () => {
    const newTopic = {
      slug: "cats",
      description: "The fog is coming",
    }
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("400: Returns an error if topic key is missing", () => {
    const newTopic = {
      description: "The fog is coming",
    }
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
  test("400: Returns an error if description key is missing", () => {
    const newTopic = {
      slug: "fog",
    }
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request")
      })
  })
})
