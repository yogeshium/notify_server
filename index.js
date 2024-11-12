import {initializeApp, applicationDefault } from 'firebase-admin/app';
import { getMessaging } from "firebase-admin/messaging";
import express, { json } from "express";
import cors from "cors";
import env from "dotenv";
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


initializeApp({
  credential: applicationDefault(),
  projectId: "iot-project-169dd",
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

app.listen(3000, function () {
  console.log("Server started on port 3000");
});