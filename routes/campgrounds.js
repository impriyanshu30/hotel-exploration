
var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
//var middleware = require("../middleware/mindex");

//INDEX ROUTE

router.get("/", function (req,res) {
	//Get all campgrounds from DB
	Campground.find({},function(err,allCampgrounds){
		if(err)
			console.log(err);
		else
			res.render("campgrounds",{campgrounds:allCampgrounds});
	});
	
	// body...
});


//CREATE-ADD NEW CAMPGROUND TO DB
router.post("/", isloggedIn, function (req,res) {
	//get data from form and add to campgrounds array
	var name=req.body.name;
	var image=req.body.image;
	var description=req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name,image:image,description:description,author:author};
	Campground.create(newCampground,function(err,newlyCreated){
		if(err)
			console.log(err);
		else
			res.redirect("/campgrounds");		
	}); 
	//campgrounds.push(newCampground);
	// body...
	
}); 


//NEW-SHOW FORM TO CREATE NEW CAMPGROUND
router.get("/new", isloggedIn, function (req,res) {
	res.render("new.ejs");
	// body...
});

//SHOW- shows more info about one campground
router.get("/:id", function (req,res){
	//find campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err)
			console.log(err);
		else{
			console.log(foundCampground);
			res.render("show",{campground: foundCampground});
		}

	});
	//render show template with that campground
	
});

//EDIT ROUTE
router.get("/:id/edit",checkcampground, function (req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		 res.render("edit",{campground: foundCampground});
			
	});
});


//UPDATE ROUTE
router.put("/:id",checkcampground,function(req,res){
	//req.body.blog.body=req.sanitize(req.body.blog.body);
Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
	if(err)
		res.redirect("/campgrounds");
	else{
		//res.redirect("/campgrounds");
		res.redirect("/campgrounds/" + req.params.id);
	}
		
	});
	
});


//DESTROY CAMPGROUND ROUTE

router.delete("/:id",checkcampground,function(req,res){
	//destroy blog
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err)
			res.redirect("/campgrounds");
		else
			res.redirect("/campgrounds");	
	});
	//redirect somewhere	
});





// //MIDDLEWARE
function isloggedIn(req,res,next) {
  if(req.isAuthenticated())
    return next(); //if user is loggen in then move

  req.flash("error","Please Login First!");
  res.redirect("/login");  //else login page
}


function checkcampground(req,res,next){
	if(req.isAuthenticated()){

		Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			req.flash("error","Campground not found");
			res.redirect("back");
		}
		else{
			//does user own the campground
			if(foundCampground.author.id.equals(req.user._id)){
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

module.exports= router;




