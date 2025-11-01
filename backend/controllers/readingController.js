const pool = require("../db/pool");

exports.readingLastest = async (req, res) => {
  try {
    const user_id = Number(req.user.user_id);

    if (!user_id) {
      return res.status(404).json({
        message: "ID ไม่ถูกต้อง",
      });
    }

    const [rows] = await pool.query(
      `
      SELECT 
      d.device_id,
      d.owner_id,
      d.serial_number,
      d.name,
      d.status,
      ds.temperature_c,
      ds.humidity_pct,
      ds.updated_at 
      FROM device_status ds 
      LEFT JOIN devices d ON ds.device_id = d.device_id 
      WHERE owner_id = ?
      ORDER BY ds.updated_at DESC
      `,
      [user_id]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: "ไม่พบข้อมูลเซนเซอร์ในระบบ",
      });
    }

    return res.status(200).json({
      message: "ดึงข้อมูลสำเร็จแล้ว",
      data: rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "เซิร์ฟเวอร์ไม่ตอบสนอง",
    });
  }
};

exports.getReadings = async (req, res) => {
  try {
    const device_id = Number(req.params.id);
    const user_id = Number(req.user.user_id);
    const role = String(req.user.role);

    const [[checkDevices]] = await pool.query(
      "SELECT device_id , owner_id FROM devices WHERE device_id = ?",
      [device_id]
    );

    if (!checkDevices) {
      return res.status(404).json({
        message: "ไม่พบอุปกรณ์ชิ้นนี้ในระบบ",
      });
    }

    if (!device_id) {
      return res.status(404).json({
        message: "ID ไม่ถูกต้อง",
      });
    }

    if (role !== "admin" && checkDevices.owner_id !== user_id) {
      return res.status(401).json({
        message: "ไม่มีสิทธิ์เข้าถึงรายละเอียดของอุปกรณ์นี้",
      });
    }

    const [rows] = await pool.query(
      `
        SELECT 
        d.device_id,
        d.serial_number,
        d.name,
        d.status,
        d.owner_id,
        sr.temperature_c,
        sr.humidity_pct,
        sr.read_at
        FROM sensor_reading sr
        LEFT JOIN devices d ON sr.device_id = d.device_id WHERE d.device_id = ? ORDER BY sr.read_at DESC LIMIT 50
         `,
      [device_id]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: "ไม่มีข้อมูลเซนเซอร์ในระบบ",
      });
    }

    return res.status(200).json({
      message: "ดึงข้อมูลรายละเอียดสำเร็จแล้ว",
      data:rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "เซิร์ฟเวอร์ไม่ตอบสนอง",
    });
  }
};
