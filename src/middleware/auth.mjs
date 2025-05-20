import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev_secret';

export function generateToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}

export function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ code: 401, message: 'Token missing' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ code: 403, message: 'Invalid token' });
    req.user = user;
    next();
  });
}
