const {
  selectCommentsFromAnArticle,
  addNewComment,
  removeComment,
  updateComment,
} = require("../models/comments.models")
const { checkIdExists, checkUserameExists } = require("../utils")

exports.getCommentsForArticle = (req, res, next) => {
  const { article_id } = req.params
  const { limit, p } = req.query
  const promises = [
    selectCommentsFromAnArticle(article_id, limit, p),
    checkIdExists(article_id, "articles", "article_id"),
  ]
  Promise.all(promises)
    .then((results) => {
      const comments = results[0]
      res.status(200).send({ comments })
    })
    .catch(next)
}

exports.postCommentToArticle = (req, res, next) => {
  const { body } = req
  const { article_id } = req.params
  const { username } = body
  promises = [
    checkIdExists(article_id, "articles", "article_id"),
    checkUserameExists(username),
  ]
  Promise.all(promises)
    .then(() => {
      return addNewComment(body, article_id)
    })
    .then((comment) => {
      res.status(201).send({ comment })
    })
    .catch(next)
}

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params
  const promises = [checkIdExists(comment_id, "comments", "comment_id")]
  Promise.all(promises)
    .then(() => {
      return removeComment(comment_id)
    })
    .then(() => {
      res.status(204).send()
    })
    .catch(next)
}

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params
  const { inc_votes } = req.body
  const promises = [checkIdExists(comment_id, "comments", "comment_id")]
  Promise.all(promises)
    .then(() => {
      return updateComment(comment_id, inc_votes)
    })
    .then((comment) => {
      res.status(200).send({ comment })
    })
    .catch(next)
}
