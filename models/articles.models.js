const db = require("../db/connection")

exports.selectArticle = (id) => {
  let queryStr =
    "SELECT articles.*, cast(count(comments.comment_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id "
  const queryParams = []
  if (id) {
    queryStr += `WHERE articles.article_id = $1 `
    queryParams.push(id)
  }
  queryStr += "GROUP BY articles.article_id "
  return db.query(queryStr, queryParams).then((data) => {
    if (!data.rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" })
    } else {
      return data.rows[0]
    }
  })
}

exports.selectAllArticles = (topic) => {
  let queryStr =
    "SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, count(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id "
  const queryParams = []
  if (topic) {
    queryStr += "WHERE topic = $1 "
    queryParams.push(topic)
  }
  queryStr += "GROUP BY articles.article_id ORDER BY articles.created_at desc "
  return db.query(queryStr, queryParams).then((data) => {
    return data.rows
  })
}

exports.updateArticle = (id, newInfo) => {
  let queryStr =
    "UPDATE articles SET votes = votes + $2 WHERE articles.article_id = $1 RETURNING * "
  const queryParams = [id, newInfo.inc_votes]
  return db.query(queryStr, queryParams).then((data) => {
    return data.rows[0]
  })
}
