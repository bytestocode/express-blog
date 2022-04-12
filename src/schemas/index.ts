// const mongoose = require("mongoose");
import mongoose from "mongoose";

const connect = () => {
  mongoose
    .connect("mongodb://localhost:27017/sparta_db")
    .catch((err) => console.log(err));
};

// 에러 캐치하는 코드 (위의 catch와 동일한 기능?)
mongoose.connection.on("error", (err) => {
  console.error("몽고DB 연결 에러", err);
});

// module.exports = connect;
export default connect;
