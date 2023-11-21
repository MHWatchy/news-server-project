const {
  selectArticle,
  selectAllArticles,
  selectCommentsFromAnArticle,
} = require("../models/articles.models")
const { checkIdExists } = require("../utils")

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params
  selectArticle(article_id)
    .then((article) => {
      res.status(200).send({ article })
    })
    .catch(next)
}

exports.getAllArticles = (req, res, next) => {
  selectAllArticles().then((articles) => {
    res.status(200).send({ articles })
  })
}
