const db = require("../db/connection")

exports.selectArticle = (id) => {
  let queryStr = "SELECT * FROM articles "
  const queryParams = []
  if (id) {
    queryStr += `WHERE article_id = $1 `
    queryParams.push(id)
  }
  return db.query(queryStr, queryParams).then((data) => {
    if (!data.rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" })
    } else {
      return data.rows[0]
    }
  })
}



exports.selectCommentsFromAnArticle = (id) => {
  let queryStr =
    "SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments JOIN articles ON comments.article_id = articles.article_id WHERE articles.article_id = $1 ORDER BY comments.created_at desc"
  const queryParams = [id]
  return db.query(queryStr, queryParams).then((data) => {
    return data.rows
  })
}
