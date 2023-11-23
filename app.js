const express = require("express")
const {
  handleCustom,
  handlePsql,
  handleServer,
  handleFoF,
} = require("./controllers/errors.controllers")
const apiRouter = require("./routers/api.routers")

const app = express()

app.use(express.json())

app.use("/api", apiRouter)

app.all("*", handleFoF)

app.use(handleCustom)
app.use(handlePsql)
app.use(handleServer)

module.exports = app
