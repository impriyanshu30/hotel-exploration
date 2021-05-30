
var express  =  require("express"),
 		app  =  express(),
 bodyParser  =  require("body-Parser"),
 	mongoose =  require("mongoose"),
 	flash = require("connect-flash"),
 	passport=require("passport"),
 	LocalStrategy=require("passport-local"),
 	methodOverride=require("method-override"),
 Campground  =  require("./models/campground"),
 	Comment  =  require("./models/comment"),
 	User = require("./models/user1"),
 	seedDB   =  require("./seeds");


 	//REQUIRING ROUTES
 	var commentRoutes = require("./routes/comments"),
 		campgroundRoutes = require("./routes/campgrounds"),
 		indexRoutes = require("./routes/index");

//seedDB();
//var ejs = require('ejs');
//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb+srv://priyanshu:Shreyansh@123@hotel.3qcbh.mongodb.net/yelp_camp?retryWrites=true&w=majority",{useUnifiedTopology: true,
  useNewUrlParser: true});
//mongodb+srv://priyanshu:<password>@hotel.3qcbh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//PASSPORT CONFIGURATION

app.use(require("express-session")({
	secret:"i am the best",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//it will call this function on every single route

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds" , campgroundRoutes);
app.use("/campgrounds/:id/comments" , commentRoutes);

app.listen(3000,function () {
	console.log("server has started");
	// body...
}); 