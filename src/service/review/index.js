const express = require("express")
const fs = require("fs")
const path = require("path")
const uniqid = require("uniqid")

const router = express.Router()

const readFile = (fileName) => {
    const buffer = fs.readFileSync(path.join(__dirname, fileName))
    const fileContent = buffer.toString()
    return JSON.parse(fileContent)
  }

  router.get("/", (req, res) => {
    const reviewDB = readFile("review.json")
    if (req.query && req.query.name) {
      const reviewProjects = reviewDB.filter(
        (review) =>
          review.hasOwnProperty("name") &&
          review.name.toLowerCase() === req.query.name.toLowerCase()
      )
      res.send(reviewProjects)
    } else {
      res.send(reviewDB)
    }
  })
  
  router.get("/:ProjectId/reviews", (req, res) => {
    const reviewDB = readFile("review.json")
    const newReview =reviewDB .filter((review) => review.ProjectId=== req.params.ProjectId)
    res.send(newReview)
  })
  
  
router.post(
    "/:ProjectId/reviews",
  
    (req, res) => {
      const reviewDB = readFile("review.json")
      const newReview = {
        ...req.body,
        createdAt: new Date(),
      }
      
     
      reviewDB.push(newReview)
  
      fs.writeFileSync(
        path.join(__dirname, "review.json"),
        JSON.stringify(reviewDB)
      )
      
     
      res.status(201).send(reviewDB)
    }
  )

  router.delete("/:ProjectId/reviews", (req, res) => {
    const reviewDB = readFile("review.json")
    const newDb = reviewDB.filter((x) => x.ProjectId  !== req.params.ProjectId)
    fs.writeFileSync(path.join(__dirname, "review.json"), JSON.stringify(newDb))
  
    res.send(newDb)
  })
  
  router.put("/:ProjectId/reviews", (req, res) => {
    const reviewDB = readFile("review.json")
    const newDb = reviewDB.filter((x) => x.ProjectId !== req.params.ProjectId ) //removing previous item
    const reviews = req.body
    reviews.ProjectId  = req.params.ProjectId 
    newDb.push(reviews) //adding new item
    fs.writeFileSync(path.join(__dirname, "review.json"), JSON.stringify(newDb))
  
    res.send(newDb)
  })
  
module.exports = router