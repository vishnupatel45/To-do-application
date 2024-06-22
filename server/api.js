
var express = require("express");
var cors = require("cors");
const { Double } = require("mongodb");
var mongoClient = require("mongodb").MongoClient;

var app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

var connection = "mongodb://127.0.0.1:27017";

app.get("/user",(req,res)=>{

    mongoClient.connect(connection).then(objdata =>{
        var database = objdata.db("test");
        database.collection("user").find({}).toArray().then(Document =>{
            res.send(Document);
            res.end();
        });
    });
});

app.post("/register",(req,res) =>{
    var userData ={
        Id:req.body.Id,
        Name:req.body.Name,
        Age:parseInt(req.body.Age),
        Mobile:parseInt(req.body.Mobile),
        Password:req.body.Password
    }               
    mongoClient.connect(connection).then(userdeitails =>{
        var database = userdeitails.db("test");
        database.collection("user").insertOne(userData).then(()=>{
            console.log("register Update");
            res.end();
        });
    });           
});

app.get("/Appointment/:Name",(req,res)=>{
    mongoClient.connect(connection).then(objdata =>{
        var database = objdata.db("test");
        database.collection("Appointment").find({Name:req.params.Name}).toArray().then(document =>{
            res.send(document);
            res.end();
        });
    });
});

app.delete("/delete/:id",(req,res)=>{
    mongoClient.connect(connection).then(objdata =>{
        var database = objdata.db("test");
        database.collection("Appointment").deleteOne({Appointmentid:parseInt(req.params.id)}).then(()=>{
            connection.log("task deleted");
            res.end();
        });
    });
});

app.post("/add-task",(req,res) =>{
    var usertask = {
        Appointmentid:req.params.Id,
        Title:req.params.Title,
        Discription:req.params.Discription,
        Date:new Date(req.params.Discription),
        Name:req.params.Name
    };
    mongoClient.connect(connection).then(objdata =>{
        var database = objdata.db("test");
        database.collection("Appointment").insertOne(usertask).then(()=>{
            console.log("Appointment Is Updated to Database");
            res.end();
        });
    });
});

app.put("/addchange-task/:id",(req,res) =>{
    var id = parseInt(req.params.id);
    mongoClient.connect(connection).then(objdata =>{
        var database = objdata.db("test");
        database.collection("Appointment").updateOne({Appointmentid:id},{$set:{Appointmentid:id,Title:req.body.Title,Discription:req.body.Discription,Date:new Date(req.body.Discription)}}).then(document =>{
            console.log("task Updated");
            res.end();
        })
    });
});

app.get("/edit-task/:id",(req,res)=>{
    mongoClient.connect(connection).then(objdata =>{
        var database = objdata.db("test");
        database.collection("Appointment").find({Appointmentid:parseInt(req.params.id)}).toArray().then(document =>{
            res.send(document);
            res.end();
        });
    });
});


app.listen(7000);
console.log("http://127.0.0.1:7000/Appointment/1");


