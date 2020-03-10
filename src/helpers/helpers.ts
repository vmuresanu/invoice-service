import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

export async function comparePassword(attempt, password) {
  return await bcrypt.compare(attempt, password);
}

export function getToken(id, username) {
  return jwt.sign({
      id,
      username,
    },
    process.env.SECRET,
    { expiresIn: '10m', algorithm: 'RS512', issuer: username },
  );
}

export function verifyToken(token) {
  return jwt.verify(
    token,
    process.env.SECRET,
    (err, decoded) => {
      if (err) {
        console.log(err)
      }
      console.log(decoded)
    }
  );
}
