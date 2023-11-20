const db = require("../db/connection")

exports.returnEndpoints = () => {
    return db.query("SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_type = 'BASE TABLE'").then((data) => {
    })
}