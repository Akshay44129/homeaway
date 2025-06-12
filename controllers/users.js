const User =require("../models/user");



module.exports.renderSignupForm  =(req, res) => {
   
    res.render("users/signup");
};

module.exports.signup =async (req, res) => {
    try {
        
        let { username, email, Password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, Password);
       
        req.login(registerUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to HomeAway!");
            res.redirect("/listings");
        });    
    } catch (err) {
        console.error("Signup Error:", err);
        req.flash("error", "Signup failed. Please try again.");
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm= (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login= async(req,res)=>{
    //  res.send(" welcome to the homeaway");
    req.flash("success", "welcome back to homeaway ! ")
    let redirectUrl =res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next (err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
};
