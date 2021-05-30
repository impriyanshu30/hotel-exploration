var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user1");


//ROOT ROUTE
router.get("/", function (req,res) {
	res.render("land");
	// body...
});



//show signup/register form
router.get("/register",function (req,res){
	res.render("register");
	// body...
});

//handling user sign up
router.post("/register",function (req,res){
	req.body.username
	req.body.password

	User.register(new User({username: req.body.username}),req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","user.username");
			res.redirect("/campgrounds");
		});
	});

	// body...
});



//LOGIN ROUTE

router.get("/login",function (req,res){
	res.render("login");
	// body...
});

//login logic
router.post("/login",passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}),function (req,res){

});


//LOGOUT ROUTE
//logout
router.get("/logout",function (req,res){
	req.logout();
	req.flash("success","Logged you out!");
	res.redirect("/campgrounds");

	// body...
});


//this dowm here is middleware
function isloggedIn(req,res,next) {
	if(req.isAuthenticated())
		return next(); //if user is loggen in then move

	req.flash("error","Please login first!");
	res.redirect("/login");  //else login page
}

module.exports=router;