const { selectCommentsFromAnArticle } = require("../models/comments.models")
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
