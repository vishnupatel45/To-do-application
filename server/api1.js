var express = require("express");
var cors = require("cors");
const { Double } = require("mongodb");
var mongoClient = require("mongodb").MongoClient;

var app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

var conectionstring = "mongodb://127.0.0.1:27017";

app.get("/users",(req,res)=>{
    mongoClient.connect(conectionstring).then(obj =>{
        var database = obj.db("test");
        database.collection("Admin").find({}).toArray().then(document =>{
            res.send(document);
            res.end();
        });
    });
});
app.post("/add-user",(req,res)=>{
    var user = {
       Name:req.params.Name
    }

    mongoClient.connect(conectionstring).then(obj =>{
        var database = obj.db("test");
        database.collection("userfrom").insertOne(user).then(() =>{
            res.send('user is udated to database successfully thank YOU!');
            res.end();
        });
    });
});

app.delete("/delete-users/:category",(req,res) =>{
    mongoClient.connect(conectionstring).then(obj =>{
        var database = obj.db("test");
        database.collection("Admin").deleteMany({category:req.params.category}).then(()=>{
            res.send("category deleted successfully thank YOU!");
            res.end();
        })   //"category": "men's clothing",
    })
})

app.listen(1300);
console.log("http://127.0.0.1:1300/add-user");
