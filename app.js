const express = require("express")
const {
  handleCustom,
  handlePsql,
  handleServer,
} = require("./controllers/errors.controllers")
const { getApi } = require("./controllers/api.controllers")
const { getTopics } = require("./controllers/topics.controllers")
const { getArticleById, getCommentsForArticle } = require("./controllers/articles.controllers")

const app = express()

app.use(express.json())

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentsForArticle)

app.get("/*", (req, res, next) => {
  res.status(404).send({ msg: "Not found" })
})

app.use(handleCustom)
app.use(handlePsql)
app.use(handleServer)

module.exports = app
