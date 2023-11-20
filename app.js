const express = require("express")
const { handleCustom, handlePsql, handleServer } = require("./controllers/errors.controllers")
const { getTopics } = require("./controllers/topics.controllers")

const app = express()

app.use(express.json())

app.get("/api/topics", getTopics)

app.use(handleCustom)
app.use(handlePsql)
app.use(handleServer)

module.exports = app