const express = require("express");
const app = express();
const PORT = 3000;
const router = require("./routes");
const connect = require("./schemas");
connect();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", router);

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
