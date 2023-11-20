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
