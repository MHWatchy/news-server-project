const {
  selectArticle,
  selectAllArticles,
  updateArticle,
} = require("../models/articles.models")
const { checkIdExists, checkTopicExists } = require("../utils")

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params
  selectArticle(article_id)
    .then((article) => {
      res.status(200).send({ article })
    })
    .catch(next)
}

exports.getAllArticles = (req, res, next) => {
  const { topic } = req.query
  const promises = [selectAllArticles(topic)]
  if (topic) promises.push(checkTopicExists(topic))
  Promise.all(promises).then((results) => {
    articles = results[0]
    res.status(200).send({ articles })
  }).catch(next)
}

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params
  const { body } = req
  const promises = [
    updateArticle(article_id, body),
    checkIdExists(article_id, "articles", "article_id"),
  ]
  Promise.all(promises)
    .then((results) => {
      const article = results[0]
      res.status(201).send({ article })
    })
    .catch(next)
}
