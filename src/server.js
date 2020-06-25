const express = require("express")
const listEndpoints = require("express-list-endpoints")
const usersRouter = require("./service/users")
const projectRouter = require("./service/project")

const problematicRoutes = require("./service/ProblematicRoutes")
const cors = require("cors")
const {
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
} = require("./errorHandling")

const server = express()


const port = process.env.PORT || 3005

const loggerMiddleware = (req, res, next) => {
  console.log(`Logged ${req.url} ${req.method} -- ${new Date()}`)
  next()
}
server.use(cors())
server.use(express.json()) // Built in middleware
server.use(loggerMiddleware)

// ROUTES
server.use("/users", loggerMiddleware, usersRouter)
server.use("/project",loggerMiddleware, projectRouter)
server.use("/problems", problematicRoutes)

// ERROR HANDLERS

server.use(notFoundHandler)
server.use(unauthorizedHandler)
server.use(forbiddenHandler)
server.use(catchAllHandler)

console.log(listEndpoints(server))

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
