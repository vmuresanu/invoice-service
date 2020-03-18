import { IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';

export class UserRequest {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
