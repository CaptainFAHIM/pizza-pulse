const Order = require("../../../models/order");
const moment = require("moment");


function orderController() {
    return{
        store(req, res){
            // Validate request
            const {phone, address} = req.body;
            if(!phone || !address){
                req.flash("error", "All fields are required");
                return res.redirect("/cart");
            }

            const order = new Order({
                customerId: req.user.id,
                items: req.session.cart.items,
                phone,
                address
            });
            order.save().then(result => {
                req.flash("success", "Order Placed successfully");
                delete req.session.cart;
                return res.redirect("/customer/orders");
            }).catch(err => {
                console.log(err);
                req.flash("error", "Something went wrong");
                return res.redirect("/cart");
            });
        },
        async index(req, res){
            const orders = await Order.find({customerId: req.user.id}, null, {sort: {"createdAt": -1}});
            res.render("customers/orders", {orders: orders, moment: moment});
        },
        async show(req, res){
            const order = await Order.findById(req.params.id);
            // Authorize user
            if(req.user.id.toString() === order.customerId.toString()){
                return res.render("customers/singleOrder", {order});
            }
            return res.redirect("/");
        }
    }
}


module.exports = orderController;