import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import CreateUserDto from './dto/create_user.dto';
import { User, UserDocument } from 'src/schemas/User.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  async createNewUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.createUser(createUserDto);

    return user;
  }
}
