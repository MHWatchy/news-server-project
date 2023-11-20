const {
  selectArticle,
  selectCommentsFromAnArticle,
} = require("../models/articles.models")

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params
  selectArticle(article_id)
    .then((article) => {
      res.status(200).send({ article })
    })
    .catch(next)
}

exports.getCommentsForArticle = (req, res, next) => {
  const {article_id} = req.params
  selectCommentsFromAnArticle(article_id).then((comments) => {
    res.status(200).send({ comments })
  })
}
