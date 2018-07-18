var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var sanitizer = require("express-sanitizer");

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(sanitizer());
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/blogApp", { useNewUrlParser: true });

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("blog", blogSchema);

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", {blogs: blogs});
        }
    });
});

app.get("/blogs/new", function(req, res) {
    res.render("new");
});

app.post("/blogs", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            res.render("new");
        }
        else {
            res.redirect("blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, blogId) {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.render("show", {blog: blogId});
        }
    });
});

app.get("/blogs/:id/edit", function(req,res) {
    Blog.findById(req.params.id, function(err, blogId) {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.render("edit", {blog: blogId});
        }
    });
});

app.put("/blogs/:id", function(req,res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, UpdatedBlog) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.delete("/blogs/:id", function(req,res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP);