const bcrypt = require("bcryptjs");
const pool = require("../db/pool");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.register = async (req, res) => {
  try {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");
    const confirmPassword = String(req.body.confirmPassword || "").trim();
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    if (!username || !password || !confirmPassword || !email) {
      return res.status(400).json({
        message: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
    }

    if (username.length < 5) {
      return res.status(400).json({
        message: "ชื่อผู้ใช้ต้องมีอย่างน้อย 5 ตัวอักษร",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "กรุณากรอกรหัสผ่านให้ตรงกัน",
      });
    }

    const [exitsUserRows] = await pool.query(
      "SELECT user_id FROM users WHERE username = ? LIMIT 1",
      [username]
    );

    if (exitsUserRows.length > 0) {
      return res.status(409).json({
        message: "มีชื่อผู้ใช้นี้อยู่แล้วในระบบ",
      });
    }

    const [exitsEmailRows] = await pool.query(
      "SELECT user_id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (exitsEmailRows.length > 0) {
      return res.status(409).json({
        message: "มีอีเมลนี้อยู่แล้วในระบบ",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await pool.query(
      "INSERT INTO users (username, password_hash, email , role) VALUES (?, ?, ? ,'user1')",
      [username, hashedPassword, email]
    );

    return res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "เซิร์ฟเวอร์ไม่ตอบสนอง",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const usernameOrEmail = String(req.body.usernameOrEmail || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");

    if (!usernameOrEmail) {
      return res.status(400).json({
        message: "กรุณากรอกชื่อผู้ใช้หรืออีเมล",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "กรุณากรอกรหัสผ่าน",
      });
    }

    const [rows] = await pool.query(
      "SELECT user_id , username , email , password_hash , role FROM users WHERE username = ? OR email = ? LIMIT 1",
      [usernameOrEmail, usernameOrEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "ชื่อผู้ใช้อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      });
    }

    const user = rows[0];

    const passwordIsMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordIsMatch) {
      return res.status(401).json({
        message: "ชื่อผู้ใช้อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "เซิร์ฟเวอร์ไม่ตอบสนอง",
    });
  }
};

exports.me = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      "SELECT user_id , username , email , role , create_at FROM users WHERE user_id = ? LIMIT 1",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "ไม่พบผู้ใช้งาน",
      });
    }

    const user = rows[0];

    return res.status(200).json({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
      create_at: user.create_at,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เซิร์ฟเวอร์ไม่ตอบสนอง",
    });
  }
};
