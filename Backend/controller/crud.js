const connection = require("../configure/database");
exports.createTask = (req, res) => {
  const { title, description, dueDate, status } = req.body;
  if (!title || !description || !dueDate || !status) {
    return res.status(400).json({ Error: "All fields are required", Success: 0 });
  }
  const sql = `INSERT INTO task (title, description, due_date, status) VALUES (?, ?, ?, ?)`;
  connection.query(sql, [title, description, dueDate, status], (err) => {
    if (err) {
      return res.status(500).json({ Error: "Task creation failed", Success: 0 });
    }
    res.status(201).json({ Status: "Task created successfully", Success: 1 });
  });
};
exports.getAllTasks = (req, res) => {
  const sql = "SELECT * FROM task";
  connection.query(sql, (err, tasks) => {
    if (err) {
      return res.status(500).json({ Error: "Failed to retrieve tasks", Success: 0 });
    }
    res.status(200).json({ Tasks: tasks, Success: 1 });
  });
};
exports.updateTask = (req, res) => {
  const { id, title, description, due_date, status } = req.body;
  // console.log(req.body);
  const sql = `UPDATE task  SET title = ?, description = ?, due_date = ?, status = ?  WHERE id = ?`;
  connection.query(sql, [title, description, due_date, status, id], (err, result) => {
    if (err) {
      return res.status(500).json({ Error: "Task update failed", Success: 0 });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ Error: "Task not found", Success: 0 });
    }
    res.status(200).json({ Status: "Task updated successfully", Success: 1 });
  });
};
exports.deleteTask = (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ Error: "Task ID is required", Success: 0 });
  }
  const sql = "DELETE FROM task WHERE id = ?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ Error: "Task deletion failed", Success: 0 });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ Error: "Task not found", Success: 0 });
    }
    res.status(200).json({ Status: "Task deleted successfully", Success: 1 });
  });
};
