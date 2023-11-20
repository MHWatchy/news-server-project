const express = require("express")
const { handleCustom, handlePsql, handleServer } = require("./controllers/errors.controllers")
const { getApi } = require("./controllers/api.controllers")
const { getTopics } = require("./controllers/topics.controllers")

const app = express()

app.use(express.json())

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.use(handleCustom)
app.use(handlePsql)
app.use(handleServer)

module.exports = app