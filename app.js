require('dotenv').config();
const express = require("express");
const routes = require("./routes");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
