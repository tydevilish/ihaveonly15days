const jwt = require("jsonwebtoken");

module.exports = function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) {
    return res.status(401).json({
      message: "คุณยังไม่ได้ทำการล็อกอิน",
    });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "โทเคนของคุณไม่ถูกต้อง",
    });
  }
};
