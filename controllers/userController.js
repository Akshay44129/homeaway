const User =require("../models/user"); // Adjust path based on actual User schema

module.exports.renderUserInfo = async (req, res) => {
    if (!req.user) {
        req.flash("error", "You must be logged in to view this page");
        return res.redirect("/login");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        req.flash("error", "User not found");
        return res.redirect("/");
    }

    res.render("users/info", { user });
};
