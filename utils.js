const db = require("./db/connection")

exports.checkIdExists = (id) => {
  const queryStr = "SELECT * FROM articles WHERE articles.article_id = $1 "
  const queryVals = [id]
  return db.query(queryStr, queryVals).then((data) => {
    if (!data.rows.length) {
      return Promise.reject({ status: 404, msg: "Id not found" })
    }
  })
}

exports.checkUserameExists = (username) => {
  const queryStr = "SELECT * FROM users WHERE users.username = $1 "
  const queryVals = [username]
  return db.query(queryStr, queryVals).then((data) => {
    if (!data.rows.length) {
      return Promise.reject({ status: 404, msg: "Username not found" })
    }
  })
}
