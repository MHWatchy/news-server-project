const app = require("./app")

const { PORT = 9090 } = process.env

process.env.PORT = 9090

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`)
})
