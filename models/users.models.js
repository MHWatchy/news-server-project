const db = require("../db/connection")

exports.selectAllUsers = () => {
  const queryStr = "SELECT * FROM users "
  const queryParams = []
  return db.query(queryStr, queryParams).then((data) => {
    return data.rows
  })
}

exports.selectUser = (username) => {
  const queryStr = "SELECT * FROM users WHERE users.username = $1 "
  const queryParams = [username]
  return db.query(queryStr, queryParams).then((data) => {
    if (!data.rows.length) {
      return Promise.reject({ status: 404, msg: "User not found" })
    } else {
      return data.rows[0]
    }
  })
}
