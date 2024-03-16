const User = require("../Models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res,next) => {
  const token = req.cookies.token
  // console.log("actual token ",token)
  if (!token) {
    return res.json({ status: false })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
     return res.json({ status: false })
    } else {
      const user = await User.findById(data.id)
      if (user) {
        req.user=user;
        return res.json({ status: true, user: user.username })}
      else return res.json({ status: false })
    }
  })
}
module.exports.apiMiddleware = (req, res,next) => {
  const token = req.cookies.token
  // console.log("in api middleware", token)
  if (!token) {
    return res.json({ status: false })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
     return res.json({ error: "token is not verified" })
    } else {
      const user = await User.findById(data.id)
      if (user) {
        req.user=user;
        next();
      }
      else return res.json({ error: "token problem try login again"})
    }
  })
}