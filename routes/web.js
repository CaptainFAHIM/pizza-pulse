const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const orderController = require("../app/http/controllers/customers/orderController");
const {authGuard, guest, validateUser} = require("../app/http/middlewares/authGuard");
const adminOrderController = require("../app/http/controllers/admin/orderController");
const admin = require("../app/http/middlewares/admin");

const initRoutes = (app) => {

    app.get("/", validateUser, homeController().index);
    app.get("/login", guest, authController().login);
    app.post("/login", authController().postLogin);
    app.get("/register", guest, authController().register);
    app.post("/register", authController().postRegister);
    app.post("/logout", authController().logout);
    
    app.get("/cart", validateUser, cartController().index);
    app.post("/update-cart", cartController().update);

    // Customer routes
    app.post("/orders", authGuard, validateUser, orderController().store);
    app.get("/customer/orders", authGuard, validateUser, orderController().index);

    // Admin routes
    app.get("/admin/orders", authGuard, admin, validateUser, adminOrderController().index);
}

module.exports = initRoutes;