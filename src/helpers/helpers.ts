import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import moment = require('moment');
import { InvalidSortingParameterException } from '../shared/exceptions/exceptions';

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

// Note that http://localhost:4000/invoices?sort=+title, plus sign in URL is empty space
export function handleSorting(sortExpression: string) {
  const orderOptions = {};
  const criterion = sortExpression.split(',');
  criterion.forEach(criteria => {
    const parameter = criteria.charAt(0);
    const key = criteria.substring(1);
    // ' ' - because '+' is transformed into ' '
    if (parameter !== ' ' && parameter !== '-') {
      throw new InvalidSortingParameterException();
    }
    const value = criteria.startsWith('-') ? -1 : 1;
    orderOptions[key] = value;
  });
  return orderOptions
}
