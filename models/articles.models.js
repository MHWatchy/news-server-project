const db = require("../db/connection")

exports.selectArticle = (id) => {
  let queryStr = "SELECT * FROM articles "
  if (id) {
    queryStr += `WHERE article_id = ${id} `
  }
  return db.query(queryStr).then((data) => {
    if (!data.rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" })
    } else {
      return data.rows[0]
    }
  })
}
