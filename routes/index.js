var express = require('express');
var router = express.Router();
const usermodel = require("./users");
const postmodel = require("./Post");
const passport = require("passport");
const localStrategy = require("passport-local");
passport.use(new localStrategy(usermodel.authenticate()));

const upload = require("./multer");
const { post } = require('../app');


router.get('/register', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




router.get("/profile", isLoggedIn , async function(req , res){
  const user = await usermodel.findOne({
    username:req.session.passport.user
  })
  .populate("post");

  res.render("profile" , {login:false , user});
})

router.get("/login" , function(req , res){
  res.render("login" , {error:req.flash("error")});
})


router.get("/" ,  async function(req , res){
  const post = await postmodel.find();
  // console.log(post);
  res.render("feed" , {login:true , post});
})


router.get("/uploadPost" , (req , res)=>{
  res.render("uploadPost" , {login:false})
})


router.post("/upload" , isLoggedIn ,upload.single("filename") , async function(req , res){
  if(!req.file){
    return res.status(404).send("no files were given");
  }
  const  user = await usermodel.findOne({
    username : req.session.passport.user
  });


  const postData =  await postmodel.create({
    image : req.file.filename,
    postText: req.body.description,
    title: req.body.title,
    user : user._id
  });


  user.post.push(postData._id);
  await user.save();
   res.redirect("/profile");
  
})


router.post("/register" , (req , res)=>{


 
    const userdata = new usermodel({
      email : req.body.email,
      username : req.body.username,
      fullname : req.body.fullname, 
      password: req.body.password
    });

    usermodel.register(userdata , req.body.password)
    .then(function (){
      passport.authenticate("local" )(req , res , function(){
        res.redirect("/profile");
      })
    })
});


router.post("/login" , passport.authenticate("local" , {
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true
}),  (req , res) =>{

})

router.get("/logout" , function(req , res){
  req.logOut(function(err){
    if(err) { return next(err);}
    res.redirect('/');
  })
})

function isLoggedIn(req , res , next){
  if(req.isAuthenticated())  return next();

  res.redirect("/login");
}



// router.get('/createuser', async function(req, res, next) {
//   const createdUser = await usermodel.create({

//     email: "anoop@ap.com",
//     username: "anoop" ,
//     fullName: "anoop kumar dhiman",
//     password: "anoop123"
//    });

//    res.send(createdUser);
// });



// router.get('/createdpost', async function(req, res, next) {
//   const createdPost = await postmodel.create({

//     postText: "hey everyone",
//     user:"656efc8e1e5331353666bc92",
//    });

//    let user = await usermodel.findOne({_id:"656efc8e1e5331353666bc92"});
//    user.post.push(createdPost._id);
//    await user.save();
//    res.send(createdPost);
// });

// router.get("/allpost" ,async (req , res)=>{
//     const allPost =  await usermodel
//     .find({
//       _id : "656efc8e1e5331353666bc92",
//     })
//     .populate("post");
//     res.send(allPost)
// })


module.exports = router;
