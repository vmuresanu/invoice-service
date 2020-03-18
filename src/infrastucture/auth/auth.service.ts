import { Injectable } from '@nestjs/common';
import { UserService } from '../../modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRequest } from '../../modules/user/entity/user.request';
import { comparePassword } from '../../helpers/helpers';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByUsername(username);
    if (user && await comparePassword(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserRequest) {
    const payload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload, { algorithm: 'HS512' }),
    };
  }
}
