const db = require("../db/connection")

exports.selectCommentsFromAnArticle = (id) => {
  let queryStr =
    "SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments JOIN articles ON comments.article_id = articles.article_id WHERE articles.article_id = $1 ORDER BY comments.created_at desc"
  const queryParams = [id]
  return db.query(queryStr, queryParams).then((data) => {
    return data.rows
  })
}
