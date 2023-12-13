const format = require("pg-format")
const db = require("../db/connection")
const { removeComment } = require("./comments.models")

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
    return data.rows[0]
  })
}

exports.selectAllArticles = (
  sortby = "created_at",
  order = "desc",
  topic,
  limit = 10,
  page = 1
) => {
  let queryStr =
    "SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, count(comments.comment_id) AS comment_count, CAST(count(*) OVER () AS INT) AS total_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id "
  const queryParams = []
  const verifiedSortby = [
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_id",
  ]
  const verifiedOrder = ["asc", "desc"]
  if (topic) {
    queryParams.push(topic)
    queryStr += `WHERE topic = $${queryParams.length} `
  }

  if (!verifiedSortby.includes(sortby)) {
    return Promise.reject({ status: 400, msg: "Invalid sort by" })
  } else {
    if (!verifiedOrder.includes(order)) {
      return Promise.reject({ status: 400, msg: "Invalid order" })
    } else {
      queryStr += `GROUP BY articles.article_id ORDER BY articles.${sortby} ${order} `
    }
  }

  queryParams.push(limit)
  queryStr += `LIMIT $${queryParams.length} OFFSET ${(page - 1) * limit} `

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

exports.createArticle = (inputData) => {
  const { author, title, body, topic, article_img_url } = inputData
  const newArticle = [title, topic, author, body, 0, article_img_url]
  if (!article_img_url) {
    newArticle.pop()
    formattedSql = format(
      "INSERT INTO articles (title, topic, author, body, votes) VALUES %L RETURNING *",
      [newArticle]
    )
  } else {
    formattedSql = format(
      "INSERT INTO articles (title, topic, author, body, votes, article_img_url) VALUES %L RETURNING *",
      [newArticle]
    )
  }
  return db.query(formattedSql).then((data) => {
    return data.rows[0]
  })
}

exports.removeArticle = (id) => {
  let queryStr =
    "DELETE FROM articles WHERE articles.article_id = $1 RETURNING *"
  const queryParams = [id]
  return db.query(queryStr, queryParams).then((data) => {
    return data.rows[0]
  })
}
