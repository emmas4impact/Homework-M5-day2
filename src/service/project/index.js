const express = require("express")
const fs = require("fs")
const path = require("path")
const uniqid = require("uniqid")
const port = process.env.PORT || 3005
const {join} = require("path")
const multer = require("multer")
const {writeFile} = require("fs-extra")

const router = express.Router()
const upload = multer({})
const projectsFolderPath =join(__dirname, "../../../public/img/project")

const readFile = (fileName) => {
  const buffer = fs.readFileSync(path.join(__dirname, fileName))
  const fileContent = buffer.toString()
  return JSON.parse(fileContent)
}

router.get("/:ProjectId", (req, res) => {
  const projectsDB = readFile("projectdetails.json")
  const newProject =projectsDB.filter((project) => project.ProjectId=== req.params.ProjectId)
  res.send(newProject)
})

router.get("/", (req, res) => {
  const projectsDB = readFile("projectdetails.json")
  if (req.query && req.query.name) {
    const filteredProjects = projectsDB.filter(
      (project) =>
        project.hasOwnProperty("name") &&
        project.name.toLowerCase() === req.query.name.toLowerCase()
    )
    res.send(filteredProjects)
  } else {
    res.send(projectsDB)
  }
})

router.post("/:ProjectId/upload", upload.single("avatar"), async(req, res, next)=>{
  //req.file here is where we're gonna find the single file
  
 console.log(req.file)
 //console.log(studentsFolderPath )
  
  try {
      const projectDb = readFile("projectdetails.json")
      const newDb = projectDb.map(project=>{
        if(project.ProjectId===req.params.ProjectId){
          project.image = `http://localhost:${port}/img/project/${req.params.ProjectId}.jpg`
        }
        return project
      })
      fs.writeFileSync(path.join(__dirname, "projectdetails.json"), JSON.stringify(newDb))

      await writeFile(join(projectsFolderPath, `${req.params.ProjectId}.jpg`), req.file.buffer)
      
  } catch (error) {
      console.log(error)
  }
  res.send("ok")
})

router.post(
  "/",

  (req, res) => {
    const projectsDB = readFile("projectdetails.json")
    const newproject = {
      ...req.body,
      ProjectId: uniqid(),
      createdAt: new Date(),
    }
    
    const studentdb = readFile("../users/studentdetail.json")
    
   const newDb = studentdb.map(studentDetail=>{
        if(studentDetail.studentId===req.body.studentId){
            studentDetail.numberofproject = studentDetail.numberofproject + 1
        }
        
        return studentDetail;
    })

    projectsDB.push(newproject)

    fs.writeFileSync(
      path.join(__dirname, "projectdetails.json"),
      JSON.stringify(projectsDB)
    )
    
    fs.writeFileSync(
        path.join(__dirname, "../users/studentdetail.json"),
        JSON.stringify(newDb)
      )

    res.status(201).send(projectsDB)
  }
)

router.delete("/:id", (req, res) => {
  const projectsDB = readFile("projectdetails.json")
  const newDb = projectsDB.filter((x) => x.ID !== req.params.id)
  fs.writeFileSync(path.join(__dirname, "projects.json"), JSON.stringify(newDb))

  res.send(newDb)
})

router.put("/:id", (req, res) => {
  const projectsDB = readFile("projectdetails.json")
  const newDb = projectsDB.filter((x) => x.ID !== req.params.id) //removing previous item
  const projects = req.body
  projects.ID = req.params.id
  newDb.push(projects) //adding new item
  fs.writeFileSync(path.join(__dirname, "projectdetails.json"), JSON.stringify(newDb))

  res.send(newDb)
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
