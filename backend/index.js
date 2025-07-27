const express = require("express");
const cors = require("cors");
const connectDB = require("./database/mongoose");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

connectDB();

const pageRoutes = require("./routes/pages");
app.use("/api/pages", pageRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
