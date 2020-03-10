import * as jwt from 'jsonwebtoken';
import { Injectable, Scope } from '@nestjs/common';

@Injectable()
export class ContextService {
  isLoggedIn: boolean;
  private _token: string;

  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }

  signToken(id, username) {
    return jwt.sign({
        id,
        username,
      },
      process.env.SECRET,
      { expiresIn: '10m', algorithm: 'RS512', issuer: username },
    );
  }

  verifyToken(token) {
    if (!token) {
      return false;
    }
    let verified = false;
    jwt.verify(
      token,
      process.env.SECRET,
      (err, decoded) => {
        if (err) {
          this.isLoggedIn = false;
          console.log(err)
        }
        verified = true;
        this.isLoggedIn = true;
      }
    );
    return verified;
  }
}
