import express from "express";
import Router from "./routes/route.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { Connection } from "./database/db.js";
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
app.listen(PORT, () => {
  console.log(`listening to port ${PORT}!`);
});
Connection();