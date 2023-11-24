const articlesRouter = require("express").Router()
const {
  getAllArticles,
  postArticle,
  getArticleById,
  patchArticleById,
  deleteArticleById,
} = require("../controllers/articles.controllers")
const {
  getCommentsForArticle,
  postCommentToArticle,
} = require("../controllers/comments.controllers")

articlesRouter.route("/").get(getAllArticles).post(postArticle)

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticleById).delete(deleteArticleById)

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsForArticle)
  .post(postCommentToArticle)

module.exports = articlesRouter
