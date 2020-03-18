import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserRequest } from './entity/user.request';
import { comparePassword, getToken } from '../../helpers/helpers';
import { plainToClass } from 'class-transformer';
import { UserResponse } from './entity/user.response';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>) {
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUserByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async login(userDto: UserRequest): Promise<{ token: string }> {
    const { username, password } = userDto;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await comparePassword(password, user.password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const token = getToken(user.id, user.username);
      return { token };
    }
  }

  async register(userDto: UserRequest): Promise<UserResponse> {
    const { username } = userDto;
    let user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    user = this.userRepository.create(userDto);
    return await this.userRepository.save(user)
      .then(user => {
        return plainToClass(UserResponse, user);
      });
  }
}
