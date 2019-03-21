var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    session = require("express-session"),
    request = require("request"),
    methodOverride = require("method-override");
mongoose.connect("mongodb://localhost/recommender_app");
var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//=================ROUTES===================
//show sign up form

app.get("/",function(req,res){
	res.render("home");
});

app.get("/movies",isLoggedIn,function(req,res){
	res.render("index");
});
app.get("/moviedetails",isLoggedIn,function(req,res){
	res.render("movie");
});
app.get("/register", function(req, res){
   res.render("register"); 
});

app.get("/music",isLoggedIn,function(req,res){
    res.render("music");
});
//handling user sign up
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/movies");
        });
    });
});

// LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
   res.render("login"); 
});
//login logic

//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/movies",
    failureRedirect: "/home"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, () => console.log('Recommender server has started'));