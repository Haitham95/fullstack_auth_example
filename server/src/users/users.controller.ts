import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import CreateUserDto from './dto/create_user.dto';
import ViewUserDto from './dto/user_view.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getUserProfile(@Request() req): Promise<ViewUserDto> {
    if (!req.user) {
      throw new BadRequestException('No user found');
    }

    const user = await this.usersService.getUserById(req.user.userId);

    return user;
  }
}
