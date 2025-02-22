const express = require("express");
const app = express();
require("./db/pgdb_connection");

require("dotenv").config();

app.use(express.json());

const PORT = process.env.PORT || 3000;

//Registering Routes
const indexRoutes = require("./routes/index");

//Calling routes with prefixes
app.use("/", indexRoutes);

//Initializing the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});