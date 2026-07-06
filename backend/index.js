const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const mongoDB = require("./db");

app.use(cors()); // TODO: COLOCAR IP DEPOIS.

mongoDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());
app.use("/api", require("./Routes/CreatUser"));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/OrderData"));
app.use("/api", require("./Routes/RestaurantData"));
app.use("/api", require("./Routes/PaymentData"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
