import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { InvoiceService } from '../invoice/invoice.service';
import { UserService } from './user.service';
import { UserDTO } from './entity/user.dto';
import { ValidationPipe } from '../../infrastucture/validation.pipe';

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
  login(@Body() data: UserDTO) {
    return this.usersService.login(data);
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  register(@Body() data: UserDTO) {
    console.log(data)
    return this.usersService.register(data);
  }
}
