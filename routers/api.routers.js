const apiRouter = require("express").Router()
const articlesRouter = require("./articles.routers")
const commentsRouter = require("./comments.routers")
const topicsRouter = require("./topics.routers")
const usersRouter = require("./users.routers")
const { getApi } = require("../controllers/api.controllers")

apiRouter.get("/", getApi)

apiRouter.use("/articles", articlesRouter)

apiRouter.use("/comments", commentsRouter)

apiRouter.use("/topics", topicsRouter)

apiRouter.use("/users", usersRouter)

module.exports = apiRouter
