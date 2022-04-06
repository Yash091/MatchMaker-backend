import express from "express";
import Router from "./routes/route.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { Connection } from "./database/db.js";
import { Server } from "socket.io";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/", Router);
const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
  res.send("Hello");
});

const server = app.listen(PORT, () => {
  console.log(`listening to port ${PORT}!`);
});

Connection();

/////////////////////////////////////////////////////////////////////////////////
const io = new Server(server,{
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("someone is connected");

  socket.on("newuser" , username => {
      console.log(username);
  })

  socket.on("liked", (sender , receiver) => {
      io.emit("getnotification",{sender , receiver});
  })

  socket.on("disconnect", () => {
      console.log("disconnected");
  });
});
