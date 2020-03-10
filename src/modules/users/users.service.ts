import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user';
import { Repository } from 'typeorm';
import { UserDTO } from './entity/user.dto';
import { comparePassword, getToken } from '../../helpers/helpers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>) {
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async login(userDto: UserDTO): Promise<{token: string}> {
    const { username, password } = userDto;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await comparePassword(password, user.password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const token = getToken(user.id, user.username);
      return {token};
    }
  }

  async register(userDto: UserDTO): Promise<User> {
    const { username } = userDto;
    let user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    user = this.userRepository.create(userDto);
    await this.userRepository.save(user);
    //TODO: Remove password
    return user;
  }
}
