const express = require("express")
const {
  handleCustom,
  handlePsql,
  handleServer,
  handleFoF,
} = require("./controllers/errors.controllers")
const { getApi } = require("./controllers/api.controllers")
const { getTopics } = require("./controllers/topics.controllers")
const {
  getArticleById,
  getAllArticles,
} = require("./controllers/articles.controllers")
const { getCommentsForArticle } = require("./controllers/comments.controllers")

const app = express()

app.use(express.json())

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentsForArticle)

app.post("/api/articles/:article_id/comments")

app.all("*", handleFoF)

app.use(handleCustom)
app.use(handlePsql)
app.use(handleServer)

module.exports = app
