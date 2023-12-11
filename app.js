const express = require("express")
const cors = require("cors")
const {
  handleCustom,
  handlePsql,
  handleServer,
  handleFoF,
} = require("./controllers/errors.controllers")
const apiRouter = require("./routers/api.routers")

const app = express()

app.use(cors())

app.use(express.json())

app.use("/api", apiRouter)

app.all("*", handleFoF)

app.use(handleCustom)
app.use(handlePsql)
app.use(handleServer)

module.exports = app
