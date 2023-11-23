const articlesRouter = require("express").Router()
const {
  getAllArticles,
  getArticleById,
  patchArticleById,
} = require("../controllers/articles.controllers")
const {
  getCommentsForArticle,
  postCommentToArticle,
} = require("../controllers/comments.controllers")

articlesRouter.route("/").get(getAllArticles)

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticleById)

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsForArticle)
  .post(postCommentToArticle)

module.exports = articlesRouter
