const admin= require('firebase-admin');
const  serviceAccount = require("./serviceAccountKey.json");
const express = require("express");
const {getMessaging}= require("firebase-admin/messaging");
const cors =require("cors");
const env=require( "dotenv");
env.config();

process.env.GOOGLE_APPLICATION_CREDENTIALS;

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

// app.use(function(req, res, next) {
//   res.setHeader("Content-Type", "application/json");
//   next();
// });


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://iot-project-169dd-default-rtdb.asia-southeast1.firebasedatabase.app"
});

let receivedToken=null;

app.post("/token", (req,res)=>{
    receivedToken = req.body.token;
    console.log("token: ",receivedToken);
    return res.status(200).send("recieved token");
});

app.post("/send", function (req, res) {
    
    console.log("send notification");
  const message = {
    notification: {
      title: "Danger",
      body: 'LPG gas is in danger level'
    },
    token: receivedToken,
  };
  
  getMessaging()
    .send(message)
    .then((response) => {
        console.log("Successfully sent message:", response);
      return res.status(200).json({
        message: "Successfully sent message",
        token: receivedToken,
      });
    
    })
    .catch((error) => {
    console.log("Error sending message:", error);
      return res.status(400).send(error);
    });
  
  
});

app.listen(3009, function () {
  console.log("Server started on port 3009");
});