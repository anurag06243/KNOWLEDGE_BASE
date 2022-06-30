const express=require('express');
const path=require('path');
const mongoose = require('mongoose');
const bodyParser=require('body-parser');
const expressValidator=require('express-validator');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const config=require('./config/database');

mongoose.connect(config.database);
let db=mongoose.connection;

//check for db error
db.once('open',()=>{
  console.log('connected to mongo db');
});
db.on('error',(err)=>{
  console.log(err);
});
//init app
const app=express();

//
//bring in Models
let Article=require('./models/article');
//
//
//load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//
//set public folder
app.use(express.static(path.join(__dirname, 'public')));//__ cureeent directory
//
//Express session MIddleware\
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
  // cookie: { secure: true}
}));

// Express message middleware,,....
app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages=require('express-messages')(req,res);
  next();
});
//
//
//Express validator middleware
app.use(expressValidator({
  errorFormatter:function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam= root;

    while(namespace.length){
      formParam += '['+ namespace.shift() + ']';
    }
    return{
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));

//...............................................passport config....................
require('./config/passport')(passport);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//..........................................log out function..............................
app.get('*',function(req,res,next){
  res.locals.user=req.user||null;
  next();
});
//...........................................home route...................................
// home route
app.get('/',function(req,res){
   Article.find({}, function(err,articles){
     if(err){
       consle.log(err);
     }
     else{
       res.render('index',{
         title:'Articles',
         articles:articles
       });
     }
   });
});

//................................AFTER THIS ALL ARE COPIED TO ARTICLE.JS.............................................

// Get Single Article--------------------------------------------------problem here id nahi le raha hai
// app.get('/article/:id', function(req, res){
//   Article.findById(req.params.id, function(err, article){
//     res.render('article',{
//       article:article
//     });
//   });
// });
// // --------------------------------------------------problem here id nahi le raha hai
//
// // Add route
// app.get('/articles/add',function(req,res){
//   res.render('add_article',{
//     title:'Add Articles'
//   });
// });
//
// //.......................................add submit post route...............................
//
//
// // Add submit Post Route
// app.post('/articles/add',(req,res)=>{
//   req.checkBody('title','Title is required').notEmpty();
//   req.checkBody('author','Author is required').notEmpty();
//   req.checkBody('body','Body is required').notEmpty();
//
//   // get the error
//   let errors=req.validationErrors();
//   if(errors){
//     res.render('add_article',{
//       title:'Add Article',
//       errors:errors
//     });
//   }
//   else{
//     let article=new Article();
//     article.title=req.body.title;
//     article.author=req.body.author;
//     article.body=req.body.body;
//     article.save(function(err){
//         if(err){
//           console.log(err);
//           return;
//         }
//         else{
//           req.flash('success','Article Added');
//           res.redirect('/');
//         }
//       });
//     }
// });
//
//
// //.....................................load edit  form.........................
// app.get('/article/edit/:id', function(req, res){
//   Article.findById(req.params.id, function(err, article){
//     res.render('edit_article',{
//       title:'Edit Article',
//       article:article
//     });
//   });
// });
//
// //..........................update submit post.................................................
//
// app.post('/articles/edit/:id',(req,res)=>{
//   let article={};
//   article.title=req.body.title;
//   article.author=req.body.author;
//   article.body=req.body.body;
//
//   let query = {_id:req.params.id}
//
//   Article.update(query,article,function(err){
//       if(err){
//         console.log(err);
//         return;
//       }
//       else{
//         req.flash('success','Article Updated');
//         res.redirect('/');
//       }
//     });
// });
//
//
// // ...................................DELETING ARTICLE.............................................
//
// app.delete('/article/:id',function(req,res){
//   let query = {_id:req.params.id}
//
//   Article.remove(query,function(err){
//     if(err){
//       console.log(err);
//     }
//     res.send('Success');
//   });
// });

//...................................BEFORE THIS ALL EXCEPT HOME ROUTE ARE COPIED TO ARTICLE.JS......................

//..............................................ROUTE FILES ANYTHING GO TO /articles will go to article.js file//users.js file..................................................

let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);
//.................................................................................
app.get('/',function(req,res){
  res.render('index',{
    title:'Articles'
  });
});
app.listen(3000,function(){
  console.log('server started on port 3000.....');
});
