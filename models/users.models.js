const db = require("../db/connection")

exports.selectAllUsers = () => {
  const queryStr = "SELECT * FROM users "
  const queryParams = []
  return db.query(queryStr, queryParams).then((data) => {
    return data.rows
  })
}
