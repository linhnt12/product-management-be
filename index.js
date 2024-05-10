const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const database = require("./config/database");

const routeAdmin = require("./api/routes/admin/index.route");
const route = require("./api/routes/client/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

app.use(cors({
  credentials: true,
  origin: true,
  withCredentials: true,
  methods: ["POST", "GET", "PATCH"]
}))

app.use(cookieParser());

// parse application/json
app.use(bodyParser.json());

//Routes
routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})