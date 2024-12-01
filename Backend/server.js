const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3001", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
}));
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/auth", authRoutes); 
app.use("/api/tasks", taskRoutes); 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
