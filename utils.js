const format = require("pg-format")
const db = require("./db/connection")

exports.checkIdExists = (id, table, column) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1 ", table, column)
  const queryParams = [id]
  return db.query(queryStr, queryParams).then((data) => {
    if (!data.rows.length) {
      return Promise.reject({ status: 404, msg: "Id not found" })
    }
  })
}

exports.checkUserameExists = (username) => {
  const queryStr = "SELECT * FROM users WHERE users.username = $1 "
  const queryParams = [username]
  return db.query(queryStr, queryParams).then((data) => {
    if (!data.rows.length) {
      return Promise.reject({ status: 404, msg: "Username not found" })
    }
  })
}

exports.checkTopicExists = (topic) => {
  const queryStr = "SELECT * FROM topics WHERE topics.slug = $1 "
  const queryParams = [topic]
  return db.query(queryStr, queryParams).then((data) => {
    if (!data.rows.length) {
      return Promise.reject({ status: 404, msg: "Topic not found" })
    }
  })
}
