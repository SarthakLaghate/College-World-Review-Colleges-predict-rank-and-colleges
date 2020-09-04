var express    =require('express');
var app        =express();
var bodyParser =require("body-parser");
var mongoose   =require("mongoose");
var passport   =require("passport");
var LocalStrategy=require("passport-local");
var methodOverride=require("method-override");
var nodemailer = require('nodemailer');
var flash=require('connect-flash');


mongoose.connect("mongodb://localhost:27017/college",{useNewUrlParser: true,useUnifiedTopology:true});
var Comment   =require("./models/comment");
// var User   	   =require("");
var College=require("./models/college");

var User=require("./models/user");

var seedDB=require("./seeds");

// passport config


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine","ejs");

// seedDB();

app.use(flash());

app.use(require("express-session")({

	secret:"college world",
	resave:false,
	saveUninitialized:false

}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){

	res.locals.currentUser=req.user;
	res.locals.error= req.flash("error");
	res.locals.success= req.flash("success");
	next();

});

app.get("/",function(req,res){

	res.render("landing");

});

app.get("/rank",isLoggedIn,function(req,res){

	res.render("rank");

});

app.get("/college",function(req,res){



	College.find({},function(err,allcollege){
		if(err){

			console.log(err);
		}else{

			res.render("index",{x:allcollege});
		}


	});
});

app.get("/college/new",isLoggedIn,function(req,res){

	res.render("new");

});


app.post("/college",isLoggedIn,function(req,res){

	var name=req.body.name;
	var image=req.body.image;
	var description=req.body.description;
	var obj={name:name,image:image,description:description};
	
	College.create(obj,function(err,college){

		if(err)
		{
			console.log("ERROR OCCURED");
			console.log(err);
		}else{
			req.flash("success","New College Review Added");
			res.redirect(("/college"));
		}
	});
	console.log("review added");
});

app.get("/college/:id",function(req,res){

	College.findById(req.params.id).populate("comments").exec(function(err,foundclg){

		if(err){
			console.log(err);
		}else{
			res.render("show",{college:foundclg});
		}

	})

});

app.get("/predict",function(req,res){

	res.render("predict.ejs");
});



app.get("/college/:id/comments/new",isLoggedIn,function(req,res){

	College.findById(req.params.id,function(err,college){

		if(err){
			console.log(err);
		}else{
			res.render("comform",{college:college});
		}

	})
});

app.post("/college/:id/comments",isLoggedIn,function(req,res){
	
	//lookup college id	
	College.findById(req.params.id,function(err,college){
		if(err){
			console.log(err);
			res.redirect("/college");
		}else{
			Comment.create(req.body.comment,function(err,comment){

				if(err)
				{
					console.log(err);
				}else{

					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();

					college.comments.push(comment);
					college.save();
					req.flash("success","Comment Added");
					res.redirect("/college/"+college._id);

				}
			});
		}

	});



});
//edit and delete//
//=========================================================================================================================//
app.get("/college/:id/edit",isLoggedIn,function(req,res){

	College.findById(req.params.id,function(err,foundcollege){

		if(err){

			console.log(err);
		}else{

			res.render("editid",{clg:foundcollege});

		}

	})
	


});


app.put("/college/:id",isLoggedIn,function(req,res){

	//find and update and then redirect

	College.findByIdAndUpdate(req.params.id,req.body.clg,function(err,updateCollege){

		if(err){
			res.redirect("/college");
		}else{

			req.flash("success","Successfully Updated");
			res.redirect("/college/" + req.params.id);

		}


	});

});


app.delete("/college/:id",isLoggedIn,function(req,res){

	College.findByIdAndRemove(req.params.id, function(err){

	if(err){
		
		res.redirect("/college");
	
	}else{
		req.flash("success","Successfully Deleted");
		res.redirect("/college");

	}

});

});




//+++++++++++++++++++++++++++++++++++++++++++++++++++++//

//Auth Route

app.get("/register",function(req,res){

	res.render("register");
});
app.post("/register",function(req,res){
	
	var newUser=new User({username: req.body.username});

	User.register(newUser,req.body.password,function(err,user){
		if(err){
			return res.render("register");
		}

		passport.authenticate("local")(req,res,function(){

			req.flash("success","Successfully Registered");
			res.redirect("/college");
		});

	});
});
app.get("/login",function(req,res){

	res.render("login");
});


app.post("/login", passport.authenticate("local",{
		successRedirect:"/college",
		failureRedirect:"/login"}),function(req,res){

});


app.get("/logout",function(req,res){

	req.logout();
	req.flash("success","Logged Out!");
	res.redirect("/college");
});


//email
//========================================================================================================//
app.get("/tool", function (req, res) {
  
		res.render("tool");

});


app.post('/send-email', function (req, res) {
  
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: enter your email,
    pass: enter your password
  }
});

var mailOptions = {
  from: 'sarthaklaghate7@gmail.com',
  to: req.body.email,
  subject: 'Message From - College Predictor',
  text: "Hi, thank you for using College World " + req.body.firstname + "........Enjoy......."
  // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }

  res.redirect("/tool")
});
});



//
//========================================================================================================//
function isLoggedIn(req,res,next){

	if(req.isAuthenticated()){

		return next();
	}
	req.flash("error","Please Log In First!");
	res.redirect("/login");
}


//_________________________________________________//

app.listen(3000,function(){
	console.log("college world started");
});
