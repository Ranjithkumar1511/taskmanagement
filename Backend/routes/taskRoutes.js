const express = require("express");
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} = require("../controller/crud");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/create", authenticateToken, createTask);
router.get("/get", authenticateToken, getAllTasks); 
router.put("/update", authenticateToken, updateTask);
router.delete("/delete", authenticateToken, deleteTask);

module.exports = router;
