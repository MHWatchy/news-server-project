const format = require("pg-format")
const db = require("../db/connection")

exports.selectAllTopics = () => {
  return db.query("SELECT * FROM topics").then((data) => {
    return data.rows
  })
}

exports.createTopic = (inputData) => {
  const { slug, description } = inputData
  const newTopic = [slug, description]
  if (newTopic.includes(undefined)) {
    return Promise.reject({ status: 400, msg: "Bad request" })
  }
  const formattedSQL = format(
    "INSERT INTO topics (slug, description) VALUES %L RETURNING *",
    [newTopic]
  )
  return db.query(formattedSQL).then((data) => {
    return data.rows[0]
  })
}
