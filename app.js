//jshint esversion:6
const https=require("https");
const request = require("request");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const _ = require("lodash");

const app = express();
const alert=require("alert");
app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://Fasal:6OqhCPJMmKItCfes@cluster0.7fxgr.mongodb.net/fasal?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
  console.log("Connection Successfull");
})

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({secret:'XASDASDA'}));
var ssn;

// const postSchema = {
//   title : String,
//   content : String
// };
const userSchema={
  userName: String,
  password:String,
  fullName: String,
  phone: Number,
  movies : [{

    name: String,
    image: String,
    rating: String

  }]

}

// const Post = mongoose.model("Post", postSchema);
const User = mongoose.model("User", userSchema);
// const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
// const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
// const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// // let posts = [];

// app.get("/", function(req,res){
//   res.send("bello");
// })
// app.get("/", function(req, res){
//   Post.find({}, function(err, posts){

//     res.render("home", {
 
//       startingContent: homeStartingContent,
 
//       posts: posts
 
//       });
 
//   });
// });
app.get("/", function(req, res){
  res.render("index.ejs");
  
});

app.post("/", function(req,res){
  ssn = req.session;
 // console.log(ssn);
  ssn.username = req.body.username;
  const username=req.body.username;
  const password = req.body.password;
  
  console.log(ssn.username+"                                   1");
  User.findOne({userName : username }, function(err, result){
    
   // console.log(result.password);
    //console.log(result);

    if(result==null)
    {
       alert("User not found!! (Please register)");
    
    }
    else{
      result.toJSON()
      if(password == result.password)
      {
        //console.log("I eas here")
        //const temp = {};
          const temp=[];
        // res.render("home.ejs",{movies:temp});

          const playlist = result.movies;
          //console.log(playlist);
          res.render("home.ejs",{movies:temp,playlist:playlist})
      }
      else{
        alert("Incorrect Password");
      }
    }

    // if(result==null && result.length==0)
    // {
    //   console.log("You are not a register user. Please register");
    // }
  })
  // const user= new User({
  //   userName: req.body.username,
  //  password:req.body.password,
  // })
  // user.save();
})

app.get("/register",function(req,res){
  res.render("register.ejs");
})

app.post("/register",function(req,res){
  // res.render("register.ejs");
  const user = new User({
         

    userName:req.body.username,

    password:req.body.password,

    fullName:req.body.fullname,

    phone:req.body.phone,

    
});
user.save();
res.redirect('/');
})
app.post("/home",function(req,res){
  //console.log(req.body.movies);
  ssn = req.session;
  const user = ssn.username;
  console.log(user+"                                2");
  const movieName=req.body.movies;
  const url="https://www.omdbapi.com/?apikey=7cef5d67&t="+movieName;
  request.get(url,function(error,response,body){
    movies =JSON.parse(body);
    //console.log(movies);
    
    
      User.findOne({userName:user},function(err,result){
        result.toJSON;
        const playlist = result.movies;
        //console.log(playlist);
        res.render("home.ejs",{movies:movies,playlist:playlist});
  
      });
    
    
   
  })
})
app.get("/home",function(req,res){

  ssn = req.session;
  // res.send(ssn.username);
  const user= ssn.username;
  console.log("reached");
  console.log(user);
  User.findOne({userName:user},function(err,result){
              result.toJSON;
              const playlist = result.movies;
              res.render("home.ejs",{movies:[],playlist:playlist})
        })
})

app.post("/home/addMovies",function(req,res){
  const image = req.body.poster;
  const name = req.body.title;
  const rating = req.body.imdbRating;
  ssn = req.session;
  const user=ssn.username
  var movieDetails = {
    "name": name,
    "image": image,
    "rating":rating
  };
  console.log(user+"                                              3");
  User.findOneAndUpdate(
    { userName: user }, 
    { $push: { movies: movieDetails  } },
    function (error, success) {
      // console.log(success)
            if (error==null || success==null) {
                console.log("error");
                console.log(error);
            } else {
                console.log("Success");
                // console.log(success);
                //res.redirect("/home");
        }

      });
      User.findOne({userName:user},function(err,result){
        result.toJSON;
        const playlist = result.movies;
      //   console.log("user");
      //  console.log(user);
       
      //   console.log("result");
      //  console.log(result);
      //   console.log("playlist");
        console.log(playlist);
       // res.render("home.ejs",{movies:[],playlist:playlist})
       res.redirect('/home');
  })


});
// app.get("/about", function(req, res){
//   res.render("about", {aboutContent: aboutContent});
// });

// app.get("/contact", function(req, res){
//   res.render("contact", {contactContent: contactContent});
// });

// app.get("/compose", function(req, res){
//   res.render("compose");
// });

// app.post("/compose", function(req, res){
//   const post = new Post({
//     title: req.body.postTitle,
//     content: req.body.postBody
//   });

//   post.save(function(err){

//     if (!err){
 
//       res.redirect("/");
 
//     }
 
//   });

// });

// app.get("/posts/:postId", function(req, res){

//   // const requestedTitle = _.lowerCase(req.params.postName);
  
//   const requestedPostId = req.params.postId;

//   // posts.forEach(function(post){
//   //   const storedTitle = _.lowerCase(post.title);

//   //   if (storedTitle === requestedTitle) {
//   //     res.render("post", {
//   //       title: post.title,
//   //       content: post.content
//   //     });
//   //   }
//   Post.findOne({_id: requestedPostId}, function(err, post){

//     res.render("post", {
 
//       title: post.title,
 
//       content: post.content
 
//     });
 
//   });

// });
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function() {
  console.log("Server started on port 8000");
});
