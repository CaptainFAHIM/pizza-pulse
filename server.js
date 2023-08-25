// External imports
const express = require("express");
const app = express();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');



const PORT = process.env.PORT || 3300;
const DB_URL = process.env.DB_URL;
const COOKIE_SECRET = process.env.COOKIE_SECRET;


// Databse connection
const connectDb = async () => {
    try {
        await mongoose.connect(DB_URL);
        connection = mongoose.connection;
        console.log("Successfully connected to the database!");
    } catch (error) {
        console.log(error.message);
    }
    
}

connectDb();


// Session Store
let mongoStore = MongoDbStore.create({
    // mongooseConnection: connection,
    // collection: "sessions"
    collectionName: "sessions",
    mongoUrl: DB_URL,
    mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },

});


// Session config
app.use(session({
    secret: COOKIE_SECRET,
    resave: false,
    store: mongoStore,             
    saveUninitialized: false,
    cookie: {
    maxAge: 1000 * 60 * 60 * 24, //24 hours
  },
}));

app.use(flash());


// Assets
app.use(express.static("public"));
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    
    next();
});


// Set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

require("./routes/web")(app);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});