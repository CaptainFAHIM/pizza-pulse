// External imports
const express = require("express");
const app = express();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
require("dotenv").config();
const path = require("path");

const PORT = process.env.PORT || 3300;

// Assets
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("home");
});

// Set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});