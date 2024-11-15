var jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, 'YOUR_JWT_SECRET', (err, user) => {
        if (err?.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token đã hết hạn' });
        }
        if (err) return res.status(403).json({
            message: 'Có lỗi xảy ra!'
        });
        req.user = user;
        next();
      });
    } else {
      res.status(401).json({
        message: 'Bạn không có quyền thực hiện!'
      });
    }
}

module.exports = {
    authenticateJWT
};