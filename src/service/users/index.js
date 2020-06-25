const express = require("express")
const fs = require("fs")
const path = require("path")
const {join} = require("path")
const multer = require("multer")
const {writeFile} = require("fs-extra")
const uniqid = require("uniqid")
const port = process.env.PORT || 3005
const { check, validationResult } = require("express-validator")


const router = express.Router()
const upload = multer({})
const studentsFolderPath =join(__dirname, "../../../public/img/student")
const readFile = (fileName) => {
  const buffer = fs.readFileSync(path.join(__dirname, fileName))
  const fileContent = buffer.toString()
  return JSON.parse(fileContent)
}

// router.post("/:studentId/upload", upload.single("avatar"), async(req, res, next)=>{
//   //req.file here is where we're gonna find the single file
  
//  console.log(req.file)
//  //console.log(studentsFolderPath )
  
//   try {
//       const studentDb = readFile("studentdetail.json")
//       const newDb = studentDb.map(student=>{
//         if(student.studentId === req.params.studentId){
//           student.image = `http://localhost:${port}/img/student/${req.params.studentId}.jpg`
//         }
//         return student
//       })
//       fs.writeFileSync(path.join(__dirname, "studentdetail.json"), JSON.stringify(newDb))

//       await writeFile(join(studentsFolderPath, `${req.params.studentId}.jpg`), req.file.buffer)
//       console.log(req.params.studentId)
//   } catch (error) {
//       console.log(error)
//   }
//   res.send("ok")
// })

router.post("/:studentId/upload", upload.single("studentAvatar"), async (req, res, next) => {
  
  console.log(req.file.buffer)
  try {
    const studentsDB = readFile("studentdetail.json")
    
    const newDb = studentsDB.map((x) => {
      if(x.studentId === req.params.studentId){
          x.image = `http://localhost:${port}/img/student/${req.params.studentId}.jpg`
      }
      return x;
  })

    fs.writeFileSync(path.join(__dirname, "studentdetail.json"), JSON.stringify(newDb))

    await writeFile(
      join(studentsFolderPath, `${req.params.studentId}.jpg`),
      req.file.buffer
    )
  } catch (error) {
    console.log(error)
  }
  res.send("ok")
})
router.get("/:id", (req, res, next) => {
  try {
    const usersDB = readFile("studentdetail.json")
    const user = usersDB.filter((user) => user.ID === req.params.id)
    res.send(user)
  } catch (error) {
    error.httpStatusCode = 404
    next(error) // next is sending the error to the error handler
  }
})

router.get("/", (req, res) => {
  const usersDB = readFile("studentdetail.json")
  if (req.query && req.query.name) {
    const filteredUsers = usersDB.filter(
      (user) =>
        user.hasOwnProperty("name") &&
        user.name.toLowerCase() === req.query.name.toLowerCase()
    )
    res.send(filteredUsers)
  } else {
    res.send(usersDB)
  }
})

router.post(
  "/",
  [
    check("name")
      .isLength({ min: 4 })
      .withMessage("No no no no no")
      .exists()
      .withMessage("Insert a name please!"),
  ],
  (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        let err = new Error()
        err.message = errors
        err.httpStatusCode = 400
        next(err) // I'm sending validation errors to the middleware
      }
      const usersDB = readFile("studentdetail.json")
      const newUser = {
        ...req.body,
        studentId: uniqid(),
        createdAt: new Date(),
      }

      usersDB.push(newUser)

      fs.writeFileSync(
        path.join(__dirname, "studentdetail.json"),
        JSON.stringify(usersDB)
      )

      res.status(201).send(usersDB)
    } catch (error) {
      next(error)
    }
  }
)

router.delete("/:id", (req, res) => {
  const usersDB = readFile("studentdetail.json")
  const newDb = usersDB.filter((x) => x.ID !== req.params.id)
  fs.writeFileSync(path.join(__dirname, "studentdetail.json"), JSON.stringify(newDb))

  res.json(newDb)
})

router.put("/:id", (req, res) => {
  const usersDB = readFile("studentdetail.json")
  const newDb = usersDB.filter((x) => x.ID !== req.params.id) //removing previous item
  const users = req.body
  users.ID = req.params.id
  newDb.push(users) //adding new item
  fs.writeFileSync(path.join(__dirname, "studentdetail.json"), JSON.stringify(newDb))

  res.send(newDb)
})

router.get("/whatever", (req, res) => {})

module.exports = router
