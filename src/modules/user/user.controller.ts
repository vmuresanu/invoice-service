import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRequest } from './entity/user.request';
import { ValidationPipe } from 'core-service-vm/dist/core-service-module/pipes/validation.pipe';

@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {
  }

  @Get()
  getAllUsers() {
    return this.usersService.getAll();
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() data: UserRequest) {
    return this.usersService.login(data);
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  register(@Body() data: UserRequest) {
    console.log(data)
    return this.usersService.register(data);
  }
}
