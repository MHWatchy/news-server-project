const db = require("../db/connection")
const format = require("pg-format")

exports.selectCommentsFromAnArticle = (id, limit = 10, page = 1) => {
  let queryStr =
    "SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments JOIN articles ON comments.article_id = articles.article_id WHERE articles.article_id = $1 ORDER BY comments.created_at desc "
  const queryParams = [id]

  queryParams.push(limit)
  queryStr += `LIMIT $${queryParams.length} OFFSET ${(page - 1) * limit}`

  return db.query(queryStr, queryParams).then((data) => {
    return data.rows
  })
}

exports.addNewComment = (inputData, id) => {
  const { body, username } = inputData
  const newComment = [body, username, id, 0]
  if (typeof body != "string") {
    return Promise.reject({ status: 400, msg: "Bad request" })
  }
  const formattedSQL = format(
    "INSERT INTO comments (body, author, article_id, votes) VALUES %L RETURNING *",
    [newComment]
  )
  return db.query(formattedSQL).then((data) => {
    return data.rows[0]
  })
}

exports.removeComment = (id) => {
  let queryStr =
    "DELETE FROM comments WHERE comments.comment_id = $1 RETURNING * "
  const queryParams = [id]
  return db.query(queryStr, queryParams).then((data) => {
    return data.rows[0]
  })
}

exports.updateComment = (id, votes) => {
  let queryStr =
    "UPDATE comments SET votes = votes + $2 WHERE comments.comment_id = $1 RETURNING * "
  const queryParams = [id, votes]
  return db.query(queryStr, queryParams).then((data) => {
    return data.rows[0]
  })
}
