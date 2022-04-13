import express from "express";
import connect from "./models";
import router from "./routes";
import path from "path";
// const express = require("express");
// const connect = require("./models");
// const router = require("./routes");

const PORT = 3000;
const app = express();
app.set("view engine", "pug");
// app.set("views", process.cwd() + "/src/views");
app.set("views", process.cwd() + "/views");
// app.set("views", path.join(__dirname, "/views"));
connect();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", router);

app.listen(PORT, () => {
  console.log(`server started: http://localhost:${PORT}`);
});
