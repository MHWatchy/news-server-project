const articles = require("../db/data/test-data/articles")
const {
  selectArticle,
  selectAllArticles,
  updateArticle,
  createArticle,
  removeArticle,
} = require("../models/articles.models")
const {
  checkIdExists,
  checkTopicExists,
  checkUserameExists,
} = require("../utils")

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params
  const promises = [checkIdExists(article_id, "articles", "article_id")]
  Promise.all(promises)
    .then(() => {
      return selectArticle(article_id)
    })
    .then((article) => {
      res.status(200).send({ article })
    })
    .catch(next)
}

exports.postArticle = (req, res, next) => {
  const { body } = req
  const promises = [
    checkUserameExists(body.author),
    checkTopicExists(body.topic),
  ]
  Promise.all(promises)
    .then(() => {
      return createArticle(body)
    })
    .then(({ article_id }) => {
      return selectArticle(article_id)
    })
    .then((article) => {
      res.status(201).send({ article })
    })
    .catch(next)
}

exports.getAllArticles = (req, res, next) => {
  const { sortby, order, topic, limit, p } = req.query
  const promises = [selectAllArticles(sortby, order, topic, limit, p)]
  if (topic) promises.push(checkTopicExists(topic))
  Promise.all(promises)
    .then((results) => {
      const articles = results[0]
      res.status(200).send({ articles })
    })
    .catch(next)
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
      res.status(200).send({ article })
    })
    .catch(next)
}

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params
  const promises = [checkIdExists(article_id, "articles", "article_id")]
  Promise.all(promises)
    .then(() => {
      return removeArticle(article_id)
    })
    .then(() => {
      res.status(204).send()
    })
    .catch(next)
}
