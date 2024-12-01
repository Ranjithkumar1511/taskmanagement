const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../configure/database");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// register
exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10); 
    const insertSql = "INSERT INTO register (user_name, password) VALUES (?, ?)";
    connection.query(insertSql, [username, hashedPassword], (err) => {
      if (err) {
        return res.status(500).json({ error: "Database insert error" });
      }
      const token = jwt.sign({ id: insertSql.id }, JWT_SECRET_KEY, { expiresIn: "1h" });
      return res.status(201).json({
        success:1,
        status: "Registration successful",
        token: token,
        // user: { id: insertSql.id, username: insertSql.user_name },
      });
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error during registration" });
  }
};
// login 
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  const sql = "SELECT * FROM register WHERE user_name = ?";
  connection.query(sql, [username], async (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const user = result[0]; 
    try {
      const isMatch =  bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, { expiresIn: "1h" });
        return res.status(200).json({
          success:1,
          message: "Login successful",
          token: token,
          user: { id: user.id, username: user.user_name },
        });
      } else {
        return res.status(401).json({ error: "Invalid username or password" });
      }
    } catch (compareError) {
      return res.status(500).json({ error: "Server error during login" });
    }
  });
};
