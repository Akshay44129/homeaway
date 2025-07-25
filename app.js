if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
console.log(process.env.SECRET);

const express=require("express");
const app=express();
const mongoose =require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const { listingSchema , reviewSchema}=require("./schema.js");
const Review = require("./models/review.js");
const review = require("./models/review.js");
const session= require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport =require("passport");
const LocalStratagy =require("passport-local");
const User =require("./models/user.js");


// const UserActivation=require("UserActivation");

const listingRouter = require('./routes/listing.js');
const reviewRouter=require("./routes/review.js");
const userRouter =require("./routes/user.js");
const user = require("./models/user.js");
const userRoutes = require("./routes/user");


// const MONGO_URL="mongodb://127.0.0.1:27017/homeaway";


const dburl=process.env.ATLASDB_URL;


main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
});


// async function main(){
//     await mongoose.connect(MONGO_URL);
// }

async function main(){
    await mongoose.connect(dburl);
}
 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
    mongoUrl:dburl,
    //   mongoUrl: MONGO_URL,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 *3600 ,

});
 

store.on("error", ()=>{
    console.log("error in mongo session store", err);
});


const sessionOption ={
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}

app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratagy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
res.locals.success =req.flash("success");
res.locals.error =req.flash("error");
// console.log(res.locals.success);
res.locals.currUser =req.user;
next();
});




app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.use("/user", userRoutes); 




app.all("*",(req,res,next)=>{
next(new ExpressError(404,"page not found! "));
});

app.use((err,req,res,next)=>{
  let { statusCode,message}=err;
  res.render("error.ejs",{message});
  
});

app.listen(8080, ()=>{
    console.log("server is running on port 8080");
});