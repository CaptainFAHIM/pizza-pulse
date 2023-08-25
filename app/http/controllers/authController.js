const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authController = () => {

    // Checking the user role
    const _getRedirectUrl = (user) => {
        if(user.role === "admin"){
            return "/admin/orders";
        } else{
            return "/customer/orders";
        }
    }



    return {
        login(req, res){
            res.render("auth/login");
        },
        async postLogin(req, res){
            const {email, password} = req.body;

            // Validate request
            if(!email || !password){
                req.flash("error", "All fields are required");
                req.flash("email", email);
                return res.redirect("/login");
            }
            
            try {
                const user = await User.findOne({email});
                if(!user){
                    req.flash("error", "Wrong email or password");
                    req.flash("email", email);
                    return res.redirect("/login");
                }
                const passwordMatched = await bcrypt.compare(password, user.password);
                if(!passwordMatched){
                    req.flash("error", "Wrong email or password");
                    req.flash("email", email);
                    return res.redirect("/login");
                }


                const token = jwt.sign({id:user._id, name: user.name, email: user.email, role: user.role}, JWT_SECRET, {expiresIn:"24h"});
    
                res.cookie("jwt-login-auth", token, {httpOnly: true, maxAge: 86400000});
                res.locals.email = email;
                res.redirect(_getRedirectUrl(user));

            } catch (error) {
                req.flash("error", "Something went wrong");
                    req.flash("email", email);
                    return res.redirect("/login");
            }
        },
        register(req, res){
            res.render("auth/register");
        },
        async postRegister(req, res){
            const {name, email, password} = req.body;
            // Validate request
            if(!name || !email || !password){
                req.flash("error", "All fields are required");
                req.flash("name", name);
                req.flash("email", email);
                return res.redirect("/register");
            }

            try {
                // Check if email exist
             const result = await User.exists({email: email});
             if(result){
                req.flash("error", "Email already taken");
                req.flash("name", name);
                req.flash("email", email);
                return res.redirect("/register");
            }


            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a user
            const user = new User({
                name,
                email,
                password: hashedPassword
            });

            await user.save();
                // Login
                return res.redirect("/login");
            } catch (error) {
                req.flash("error", "Something went wrong");
                return res.redirect("/register");
            }
            
            


        },
        logout(req, res){
            res.clearCookie("jwt-login-auth");
            res.redirect("/login");
        }
    }
    
}

module.exports = authController;