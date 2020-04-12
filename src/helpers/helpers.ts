import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import moment = require('moment');

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

export function constructMomentDateTime(date, time) {
  const hour = time.split(':')[0];
  const minute = time.split(':')[1];

  return moment(date).add({ hour, minute });
}
