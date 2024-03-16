const jwt = require('jsonwebtoken');

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;
// console.log("errrrr",token)
  if (!token) {
    return next(new Error('Authentication error: Token not provided'));
  }
//  console.log("env  ",process.env.TOKEN_KEY)
  jwt.verify(token,process.env.TOKEN_KEY , (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token'));
    }

    // Attach user information to the socket for further use
    socket.user = decoded.id;

      
    
    next();
  });
};

module.exports = authenticateSocket;
