const express= require("express");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const router=express.Router();
const User =require("../models/user.js");
const { saveRedirectUrl } = require("../middleware.js");
const { renderUserInfo } = require("../controllers/userController");
const { isLoggedIn } = require("../middleware");

const userController=require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm )
.post( wrapAsync(userController.signup));


router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
     passport.authenticate("local",
        {failureRedirect:"/login",
            failureFlash:true
        }),
        userController.login
    );


router.get("/logout",userController.logout);


router.get("/info", isLoggedIn, renderUserInfo);

module.exports=router;