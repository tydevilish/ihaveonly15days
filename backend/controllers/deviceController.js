const pool = require("../db/pool");

exports.claim = async (req, res) => {
  try {
    const serial_number = String(req.body.serial_number).trim();
    const name = String(req.body.name);
    const user_id = Number(req.user.user_id);

    if (!serial_number) {
      return res.status(400).json({
        message: "กรุณากรอก Serial Number",
      });
    }

    if (!name) {
      return res.status(400).json({
        message: "กรุณาตั้งชื่ออุปกรณ์ของคุณ",
      });
    }

    const [rows] = await pool.query(
      "SELECT device_id , owner_id , status FROM devices WHERE serial_number = ? LIMIT 1",
      [serial_number]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: "ไม่พบอุปกรณ์นี้ในระบบ",
      });
    }

    const device = rows[0];

    if (device.owner_id === null) {
      const [update_result] = await pool.query(
        "UPDATE devices SET owner_id = ?, name = ?, status = ? WHERE device_id = ?",
        [user_id, name, "active", device.device_id]
      );

      if (!update_result) {
        return res.status(500).json({ message: "อัพเดทข้อมูลไม่สำเร็จ" });
      }

      return res.status(200).json({
        message: "เชื่อมต่อกับอุปกรณ์สำเร็จแล้ว",
        device_id: device.device_id,
        serial_number,
      });
    }

    if (device.owner_id !== null) {
      return res.status(401).json({
        message: "อุปกรณ์นี้มีผู้ใช้งานในระบบแล้ว",
      });
    }

    if (device.owner_id === user_id) {
      return res.status(401).json({
        message: "คุณได้เชื่อมต่อกับอุปกรณ์นี้แล้ว",
      });
    }

    return res.status(200).json({
      message: "เชื่อมต่อกับอุปกรณ์สำเร็จแล้ว",
      device_id,
      serial_number,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "เซิร์ฟเวอร์ไม่ตอบสนอง",
    });
  }
};

exports.getAllDevices = async (req, res) => {
  try {
    const role = String(req.user.role);
    const user_id = Number(req.user.user_id);

    let rows = [];

    if (role === "admin") {
      const [r] = await pool.query("SELECT * FROM devices");
      rows = r;
    } else if (role === "user1" || role === "user2") {
      const [r] = await pool.query("SELECT * FROM devices WHERE owner_id = ?", [
        user_id,
      ]);
      rows = r;
    } else {
      return res.status(403).json({
        message: "ไม่พบผู้ใช้ระดับนี้ในระบบ",
      });
    }

    if (!rows.length) {
      return res.status(404).json({
        message: "ไม่พบข้อมูลอุปกรณ์ในระบบ",
      });
    }

    return res.status(200).json({
      message: "ดึงข้อมูลสำเร็จแล้ว",
      data: rows,
    });
  } catch (error) {
    console.log("error");
    return res.status(500).json({
      message: "เซิร์ฟเวอร์ไม่ตอบสนอง",
    });
  }
};

exports.getDeviceById = async (req, res) => {
  try {
    const device_id = Number(req.params.id);
    const user_id = Number(req.user.user_id);
    const role = String(req.user.role);

    if (!device_id) {
      return res.status(404).json({
        message: "ID ไม่ถูกต้อง",
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM devices WHERE device_id = ? LIMIT 1",
      [device_id]
    );

    if (!rows.length) {
      return res.status({
        message: "ไม่พบรายละเอียดของอุปกรณ์ชิ้นนี้ในระบบ",
      });
    }

    const device = rows[0];

    if (role !== "admin" && device.owner_id !== user_id) {
      return res.status(401).json({
        message: "ไม่มีสิทธิ์ในการเข้าถึงข้อมูลนี้",
      });
    }

    return res.status(200).json({
      message: "ดึงข้อมูลโดยใช้ ID สำเร็จ",
      data: device,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "เซิร์ฟเวอร์ไม่ตอบสนอง",
    });
  }
};

exports.putDeviceById = async (req, res) => {
  try {
    const newName = String(req.body.newName);
    const newStatus = String(req.body.newStatus);
    const role = String(req.user.role);
    const user_id = Number(req.user.user_id);
    const device_id = Number(req.params.id);

    if (!device_id) {
      return res.status(404).json({
        message: "ID ไม่ถูกต้อง",
      });
    }

    const [rows] = await pool.query(
      "SELECT owner_id FROM devices WHERE device_id = ? LIMIT 1",
      [device_id]
    );

    const device = rows[0];

    if (role !== "admin" && device.owner_id !== user_id) {
      return res.status(401).json({
        message: "คุณไม่มีสิทธิ์แก้ไขรายละเอียดอุปกรณ์นี้",
      });
    }

    await pool.query(
      "UPDATE devices SET name = ? , status = ? WHERE device_id = ?",
      [newName, newStatus, device_id]
    );

    return res.status(200).json({
      message: "แก้ไขรายละเอียดของอุปกรณ์สำเร็จ",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "เซิร์ฟเวอร์ไม่ตอบสนอง",
    });
  }
};

exports.unClaimDeviceById = async (req, res) => {
  try {
    const role = String(req.user.role);
    const user_id = Number(req.user.user_id);
    const device_id = Number(req.params.id);

    if (!device_id) {
      return res.status(404).json({
        message: "ID ไม่ถูกต้อง",
      });
    }

    const [rows] = await pool.query(
      "SELECT owner_id FROM devices WHERE device_id = ? LIMIT 1",
      [device_id]
    );

    const device = rows[0];

    if (role !== "admin" && user_id !== device.owner_id) {
      return res.status(401).json({
        messsage: "คุณไม่มีสิทธิ์ตัดการเชื่อมกับอุปกรณ์นี้",
      });
    }

    await pool.query(
      "UPDATE devices SET name = ? , owner_id = ? , status = ? WHERE device_id = ?",
      [null, null, "inactive", device_id]
    );

    return res.status(200).json({
      message: "ตัดการเชื่อมต่อกับอุปกรณ์สำเร็จ",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "เซิร์ฟเวอร์ไม่ตอบสนอง",
    });
  }
};

exports.deleteDeviceById = async (req, res) => {
  try {
    const device_id = Number(req.params.id);
    const role = String(req.user.role);

    if (!device_id) {
      return res.status(404).json({
        message: "ID ไม่ถูกต้อง",
      });
    }

    if (role !== "admin") {
      return res.status(401).json({
        message: "คุณไม่มีสิทธิ์ลบอุปกรณ์ชิ้นนี้ออกจากระบบ",
      });
    }

    await pool.query("DELETE FROM devices WHERE device_id = ?", [device_id]);

    return res.status(200).json({
      message: "ลบอุปกรณ์ชิ้นนี้สำเร็จแล้ว",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "เซิร์ฟเวอร์ไม่ตอบสนอง",
    });
  }
};
