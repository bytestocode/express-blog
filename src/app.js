const express = require("express");
const connect = require("./schemas");
const router = require("./routes");

const PORT = 3000;
const app = express();
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
connect();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", router);

app.listen(PORT, () => {
  console.log(`server started: http://localhost:${PORT}`);
});
