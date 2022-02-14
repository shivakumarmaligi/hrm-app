const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const mongoose = require('mongoose');
const path = require("path");
import  ContactModel  from './Model/Contact';

// const nodemailer = require('nodemailer');

//set template engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");


//set database connection
let mongodbURl = "mongodb://localhost:27017/students";
mongoose.connect(mongodbURl, err => {
  if (err) throw err;
  console.log("database connected");
});

//connection ends here

/*serve static files to or middleware block */
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({extended:true}))//for catching post data
//end of middleware block

/*================all post starts here=============*/
app.post("/contact", async (req, res) => {
  // save incoming data to mongoDb Database
  let payload = await req.body;
  
  // ---------nodemailer---------------
  // const transporter = nodemailer.createTransport({}).sendMail({
  //   from: "theghosthunternrider73@gmail.com",
  //   to: "shivakumarmaligi253@gmail.com",
  //   subject: "Contact Form",
  //   html: `<h1>${req.body.firstName} ${req.body.lastName}</h1>
  //           <p>${req.body.email}</p>
  //           <p>${req.body.phone}</p>
  //           <p>${req.body.description}</p>
  //   `,
  // });

  let data = await ContactModel.create(payload);
  req.send(data, {text: "successfully created"});
  
})
/*================all post ends here=============*/
//basic route
app.get("/", (req, res) => {
  res.render("home",{title:"student app"});
});
app.get("/contact", (req, res) => {
  res.render("contact", { title: "submit name" });
});
//listen port
app.listen(5000, err => {
    if (err) throw err;
    console.log("server is online");
})