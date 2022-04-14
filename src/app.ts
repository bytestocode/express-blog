import express from "express";
import connect from "./models";
import router from "./routes";

const PORT = 3000;
const app = express();
app.set("view engine", "pug");
app.set("views", process.cwd() + "/views");
connect();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", router);

app.listen(PORT, () => {
  console.log(`server started: http://localhost:${PORT}`);
});
