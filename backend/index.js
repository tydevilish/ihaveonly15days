const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRouters = require("./routes/authRoute");
const deviceRouters = require("./routes/deviceRoute");
const readingRouters = require("./routes/readingRoute");
const pool = require("./db/pool");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRouters);
app.use("/api", deviceRouters);
app.use("/api", readingRouters);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});

app.get("/ping", async (req, res) => {
  try {
    const [row] = await pool.query("SELECT NOW() AS now");
    res.json({
      status: "ok",
      time: row[0].now,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "เซิร์ฟเวอร์ไม่ตอบสนอง",
    });
  }
});

app.get("/", (req, res) => {
  res.send(`Server is running on port : ${port}`);
});
