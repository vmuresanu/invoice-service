import { Exclude } from 'class-transformer';

export class UserResponse {
    @Exclude()
    id;

    username: string;

    @Exclude()
    password: string;

    createDate: Date;
}
