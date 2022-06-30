const express = require('express');
const router = express.Router();
//line 4 5 abhi add kiya
// const { Article } = require('../models/article');
// const { User } = require('../models/user');

// bring in Article Models
let Article=require('../models/article');
//bring user model
let User=require('../models/user');


// --------------------------------------------------problem here id nahi le raha hai

// Add route
router.get('/add',ensureAuthenticated,function(req,res){
  res.render('add_article', {
    title:'Add Articles'
  });
});

//.......................................add submit post route...............................


// Add submit Post Route
router.post('/add',function(req,res){
  req.checkBody('title','Title is required').notEmpty();
  // req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  // get the error
  let errors=req.validationErrors();

  if(errors){
    res.render('add_article',{
      title:'Add Article',
      errors:errors
    });
  }else{
    let article=new Article();
    article.title=req.body.title;
    // article.author=req.body.author;//error yaha pe aa raha hai read nahi kar raha id ko
    article.author=req.user._id;
    article.body=req.body.body;

    article.save(function(err){
        if(err){
          console.log(err);
          return;
        }else{
          req.flash('success','Article Added');
          res.redirect('/');
        }
      });
    }
});


//.....................................load edit  form.........................
router.get('/edit/:id',ensureAuthenticated, function(req, res){
  Article.findById(req.params.id, function(err, article){
    if(article.author!=req.user._id){
      req.flash('danger','Not Authorized');
      res.redirect('/');
    }
    res.render('edit_article',{
      title:'Edit Article',
      article:article
    });
  });
});

//..........................update submit post.................................................

router.post('/edit/:id',(req,res)=>{
  let article={};
  article.title=req.body.title;
  article.author=req.body.author;
  article.body=req.body.body;

  let query = {_id:req.params.id}

  Article.update(query,article,function(err){
      if(err){
        console.log(err);
        return;
      }
      else{
        req.flash('success','Article Updated');
        res.redirect('/');
      }
    });
});


// ...................................DELETING ARTICLE.............................................

router.delete('/:id',function(req,res){
  if(!req.user._id){
    res.status(500).send();
  }
  let query = {_id:req.params.id}

  Article.findById(req.params.id,function(err,article){
    if(article.author!=req.user._id){
      res.status(500).send();
    }else{
      Article.remove(query,function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});


// Get Single Article--------------------------------------------------problem here id nahi le raha hai
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    User.findById(article.author,function(err,user){
      if(err)return res.send(err);
        res.render('article',{
        article:article,
        author:user.name//here
      });
    });
  });
});


//.............................Access control..................................
// function ensureAuthenticated(req,res,next){
//   if(req.isAuthenticated()){
//     return next();
//   } else {
//     req.flash('danger','Please login');
//     res.redirect('/users/login');
//   }
// }
function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('danger','Please login');
    res.redirect('/users/login');
  }
}
//..................to acess the router from outside................................

module.exports=router;
