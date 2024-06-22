const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const conStr = "mongodb://127.0.0.1:27017";
const dbName = "todoDB";

// Register user API
app.post("/register-user", async (req, res) => {
    try {
        // Connect to the database
        const client = await MongoClient.connect(conStr);
        const database = client.db(dbName);

        const userData = {
            Username: req.body.username,
            Password: bcrypt.hashSync(req.body.password, 10),
            Email: req.body.email
        };

        const existingUser = await database.collection("users").findOne({ Username: userData.Username });

        if (existingUser) {
            res.status(400).json({ success: false, message: "Username already exists" });
        } else {
            await database.collection("users").insertOne(userData);
            res.status(200).json({ success: true, message: "User registered successfully", username: userData.Username });
        }

        client.close(); // Close the database connection
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ success: false, message: "Failed to register user" });
    }
});

// Login user API
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Connect to the database
        const client = await MongoClient.connect(conStr);
        const database = client.db(dbName);

        const user = await database.collection("users").findOne({ Username: username });

        if (user && bcrypt.compareSync(password, user.Password)) {
            res.status(200).json({ success: true, message: "Login successful", username: user.Username });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        client.close(); // Close the database connection
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ success: false, message: "Failed to login" });
    }
});


// Add task Api
app.post('/addtask', (req, res) => {

    try {
        const task = {
            title: req.body.tasktitle,
            description: req.body.description,
            date: new Date(req.body.taskdate), // Assuming date is in ISO format (e.g., "2024-04-09T12:00:00.000Z")
            Username: req.body.username // Associate task with user
        };
        MongoClient.connect(conStr)
            .then(clientObj => {
                clientObj.db(dbName).collection("tasks").insertOne(task)
                    .then(() => {
                        console.log("task added");
                        // res.status(201).json({ success: true, message: 'Task added successfully', taskId: result.insertedId });
                        res.end();
                    })
                    .catch(error => {
                        console.log("error adding task", error);
                        res.status(500).json({ success: false, message: "Failed to add task" });
                    })
            })
    }
    catch {
        console.log("error adding task");
    }
});

// Get Tasks api

app.get("/get-data/:username",(req,res)=>{
    const username= req.params.username;
        MongoClient.connect(conStr)
        .then(clientObj=>{
                clientObj.db(dbName).collection("tasks").find({Username:username}).toArray()
                .then((tasks)=>{
                    res.status(200).json({success:true,message:"tasks fetched successfully",tasks});
                    console.log("tasks fetched successfully");
                })
                .catch(error=>{
                    console.log("error fetching tasks");
                    res.status(500).json({message:"error fetching tasks", success:false})
                })
        })
})

// Delete task api
// Delete task API
app.delete("/delete-task/:username/:task_title", (req, res) => {
    const username = req.params.username;
    const task_title = req.params.task_title; // Get task_title from URL parameters

    MongoClient.connect(conStr)
        .then(client => {
            const db = client.db(dbName);
            db.collection("tasks").deleteOne({ "Username": username, "title": task_title }) // Use task_title to identify the task
                .then(() => {
                    res.status(200).json({ success: true, message: "Task deleted successfully" });
                })
                .catch(error => {
                    console.error("Error deleting task:", error);
                    res.status(500).json({ success: false, message: "Internal server error" });
                })
                .finally(() => {
                    client.close();
                });
        })
        .catch(error => {
            console.error("Error connecting to database:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        });
});


app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});


const PORT = 7500;
app.listen(PORT, () => {
    console.log(`Server started at http://127.0.0.1:${PORT}`);
});