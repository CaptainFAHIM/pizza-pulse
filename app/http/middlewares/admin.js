// Checking the role
const admin = (req, res, next) => {
    if(req.user.role === "admin"){
        next();
    } else{
        res.redirect("/");
    }
}

module.exports = admin;