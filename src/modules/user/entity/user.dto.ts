import { IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';

export class UserDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
