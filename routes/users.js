const express = require('express');
const router = express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');
//abhi dala hai line 6
// const { User } = require('../models/user');

//bring in User Models
let User=require('../models/user');

//register form..................................................

router.get('/register', function(req,res){
  res.render('register');
});

//........................REGISTER PROCESS................................
router.post('/register', function(req,res){
  const name=req.body.name;
  const email=req.body.email;
  const username=req.body.username;
  const password=req.body.password;
  const password2=req.body.password2;

  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('email','Email is not vlaid').isEmail();
  req.checkBody('username','Username is required').notEmpty();
  req.checkBody('password','Password is required').notEmpty();
  req.checkBody('password2','Password do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register',{
      errors:errors
    });
  }else{
    let newUser=new User({
      name:name,
      email:email,
      username:username,
      password:password
    });

    bcrypt.genSalt(10,function(err,salt){
      bcrypt.hash(newUser.password, salt,function(err,hash){
        if(err){
          console.log(err);
        }
        newUser.password=hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          }
          else{
            req.flash('success','You are registered and can log in');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});
//..............................LOGIN form............................
router.get('/login',function(req,res){
  res.render('login');
});

//.........................LOGIN PROCESS..............................
router.post('/login',function(req,res,next){
  passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req,res,next);
});

//............................LOGOUT PtOCESS............................

router.get('/logout', function(req,res){
  req.logout();
  req.flash('success','You are logged out');
  res.redirect('/users/login');
});

module.exports=router;
