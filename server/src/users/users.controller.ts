import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import CreateUserDto from './dto/create_user.dto';
import ViewUserDto from './dto/user_view.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: Apply throttling to this endpoint to prevent brute force attacks
  @Post('/create')
  async createNewUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ViewUserDto> {
    const user = await this.usersService.createUser(createUserDto);

    return user;
  }
}
