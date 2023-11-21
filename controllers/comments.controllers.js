const { selectCommentsFromAnArticle, addNewComment } = require("../models/comments.models")
const { checkIdExists } = require("../utils")

exports.getCommentsForArticle = (req, res, next) => {
  const { article_id } = req.params
  const promises = [
    selectCommentsFromAnArticle(article_id),
    checkIdExists(article_id),
  ]
  Promise.all(promises)
    .then((results) => {
      const comments = results[0]
      res.status(200).send({ comments })
    })
    .catch(next)
}

exports.postCommentToArticle = (req, res, next) => {
    const {body} = req
    const {article_id} = req.params
    const promises = [addNewComment(body, article_id), checkIdExists(article_id)]
    Promise.all(promises).then((results) => {
        const comment = results[0][0]
        res.status(201).send({comment})
    })
}