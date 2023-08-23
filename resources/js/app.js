import axios from "axios";
import Noty from "noty";
// import {initAdmin} from "./admin";
import initAdmin from "./admin";


let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.querySelector("#cartCounter");

function updateCart(pizza){
    axios.post("/update-cart", pizza).then( res => { 
        cartCounter.innerText = res.data.totalQty;

        new Noty({
            type: "success",
            timeout: 1000,
            text: "Item added to cart",
            progressBar: false,
            layout: "topLeft"
          }).show();

    }).catch(err => {

        new Noty({
            type: "error",
            timeout: 1000,
            text: "Something went wrong",
            progressBar: false,
            layout: "topLeft"
          }).show();


    });
}


addToCart.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza);
        console.log(pizza);
    });
});


// Remove alert message after 2 sec
const alertMsg = document.querySelector("#success-alert");
if(alertMsg){
    setTimeout(() => {
        alertMsg.remove()
    }, 2000);
    
}

initAdmin();