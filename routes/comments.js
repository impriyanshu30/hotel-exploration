

var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
//var middleware = require("../middleware/mindex");

//Comments New
router.get("/new", isLoggedIn, function(req, res){
    // find campground by id
    console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("cnew", {campground: campground});
        }
    })
});

//Comments Create
router.post("/", isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
          req.flash("error","Something went wrong!");
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               campground.comments.push(comment);
               campground.save();
               console.log(comment);
               req.flash("success","comment added successfully");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});


//EDIT COMMENT ROUTE
router.get("/:comment_id/edit",checkcomment,function(req,res){
  Comment.findById(req.params.comment_id, function(err,foundComment){
    if(err)
      res.redirect("back");
    else
      res.render("cedit",{campground_id: req.params.id,comment:foundComment});
  });
 
});




//UPDATE COMMENT ROUTE
router.put("/:comment_id",checkcomment,function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,function(err,updatedComment){
    if(err)
      res.redirect("back");
    else
      res.redirect("/campgrounds/" + req.params.id);
  });
 
});


//COMMENT DESTROY ROUTE

router.delete("/:comment_id",checkcomment,function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id,function(err){
    if(err)
      res.redirect("back");
    else{
      req.flash("success","comment deleted successfully");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});


//middleware

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First!");
    res.redirect("/login");
}


function checkcomment(req,res,next){
  if(req.isAuthenticated()){

    Comment.findById(req.params.comment_id,function(err,foundComment){
    if(err){
      
      res.redirect("back");
    }
    else{
      //does user own the comment

      if(foundComment.author.id.equals(req.user._id)){
        next();
      }else{
        req.flash("error","You don't have permission to do that");
        res.redirect("back");
      }

    }
  }); 
  }else
  {
    req.flash("error","Please Login First!");
    res.redirect("back");
  }
}

module.exports = router;


