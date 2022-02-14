// =======Route Level Middleware========
const { Router, response } = require("express");
// const { async } = require("jshint/src/prod-params");

const router = Router();

// ? load Multer middleware
const multer = require("multer");
let { storage } = require("../middlewares/multer");
const upload = multer({ storage: storage });

const EMPLOYEE = require("../Model/Employee");
const { ensureAuthenticated  } = require("../helper/auth_helper");
/*============== @ HTTP GET METHOD==========================
    ===============@ACCESS PUBLIC=============
    @URL employee/home
 */
router.get("/home", async (req, res) => {
  // res.render("../views/home", { title: "Home page" });
  let payload = await EMPLOYEE.find({}).lean();
  res.render("../views/home", { title: "Home Page", payload });
});

/*============== @ HTTP GET METHOD==========================
    ===============@ACCESS Private=============
    @URL employee/create-emp
 */
router.get("/create-emp", ensureAuthenticated, (req, res) => {
  res.render("../views/employees/create-emp", { title: "created employee" });
  //   console.log(res.render("hello"));
  //   res.send("ok");
});

/*============== @ HTTP GET METHOD==========================
    ===============@ACCESS PUBLIC=============
    @URL employee/emp-profile
 */
router.get("/:id", async (req, res) => {
  let payload = await EMPLOYEE.findOne({ _id: req.params.id }).lean();
  res.render("../views/employees/employeeProfile", { payload });
  console.log(payload);
});

/*============== @ HTTP GET METHOD==========================
    ===============@ACCESS PRIAVTE=============
    @URL employee/emp-profile
 */
router.get("/edit-emp/:id", ensureAuthenticated, async (req, res) => {
  let editPayload = await EMPLOYEE.findOne({ _id: req.params.id }).lean();
  res.render("../views/employees/editEmp", { editPayload });
  console.log(editPayload);
});
/*============== @ HTTP POST METHOD==========================
    ===============@ACCESS PRIVATE=============
    @URL employee/create-emp
 */
router.post(
  "/create-emp",
  ensureAuthenticated,
  upload.single("emp_photo"),
  async (req, res) => {
    let payload = {
      emp_name: req.body.emp_name,
      emp_id: req.body.emp_id,
      emp_salary: req.body.emp_salary,
      emp_edu: req.body.emp_edu,
      emp_gender: req.body.emp_gender,
      emp_exp: req.body.emp_exp,
      emp_des: req.body.emp_des,
      emp_loc: req.body.emp_loc,
      emp_email: req.body.emp_email,
      emp_phone: req.body.emp_phone,
      emp_skills: req.body.emp_skills,
      emp_photo: req.file,
      user: req.user.id,
    };
    req.flash("SUCCESS_MESSAGE", "Profile Created Successfully");
    // await EMPLOYEE_SCHEMA.create(payload);
    res.redirect("/employee/home", 302, {});
    console.log(req.body);
    console.log(req.file);
    // save to database
    await new EMPLOYEE(payload).save();
  }
);
/*=========================END ALL GET METHODS=================*/

// ==================== PUT REQUEST START HERE===================
router.put("/edit-emp/:id", upload.single("emp_photo"), (req, res) => {
  EMPLOYEE.findOne({ _id: req.params.id })
    .then(editEmp => {
      // old new              new
        (editEmp.emp_photo = req.file),
        (editEmp.emp_id = req.body.emp_id),
        (editEmp.emp_name = req.body.emp_name),
        (editEmp.emp_salary = req.body.emp_salary),
        (editEmp.emp_exp = req.body.emp_exp),
        (editEmp.emp_edu = req.body.emp_edu),
        (editEmp.emp_gender = req.body.emp_gender),
        (editEmp.emp_skills = req.body.emp_skills),
        (editEmp.emp_loc = req.body.emp_loc),
        (editEmp.emp_phone = req.body.emp_phone),
        (editEmp.emp_email = req.body.emp_email),
        (editEmp.emp_des = req.body.emp_des);
      //Update data in db
      editEmp.save().then(_ => {
        req.flash("SUCCESS_MESSAGE", "Profile Edited Successfully");
        res.redirect("/employee/home", 302, {});
      });
    })
    .catch(err => console.log(err));
      req.flash("ERROR_MESSAGE", "Something went wrong");
});
// ==================== PUT REQUEST END HERE=====================

// ==================== DELETE REQUEST STARTS HERE ==============
router.delete("/delete-emp/:id", async (req, res) => {
  await EMPLOYEE.deleteOne({ _id: req.params.id });
  req.flash("SUCCESS_MESSAGE", "Profile Deleted Successfully");
  res.redirect("/employee/home", 302, {});
});
// ==================== DELETE REQUEST ENDS HERE ================
 

module.exports = router;
