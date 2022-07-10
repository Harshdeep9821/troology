const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const errorRouter = require("./routes/errorRoute");
const userAuthRouter = require("./routes/userAuthRouter");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => console.log("DB connection successfully!"))
  .catch((e) => {
    console.log(`SomeThing went wrong with DataBase. and the error is =  ${e}`);
  });
app.get("/", (req, res) => res.send("<h1>Server is running</h1>"));
app.use("/api/v1/users", userAuthRouter);
app.use("", errorRouter);

app.listen(port, () => console.log(`Server is running on port ${port}!`));
