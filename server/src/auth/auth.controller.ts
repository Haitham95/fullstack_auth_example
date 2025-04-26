import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import UserLoginDto from './dto/user_login.dto';
import UserLoginViewDto from './dto/login_view.dto';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login endpoint
  @Post('/login')
  async login(
    @Body() loginDto: UserLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserLoginViewDto> {
    const user = await this.authService.validateUser(loginDto);

    const loggedinUser = await this.authService.login(user, res);

    return loggedinUser;
  }

  // refresh token endpoint
  @UseGuards(AuthGuard('refresh-token'))
  @Post('/refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserLoginViewDto> {
    // req.user is populated by the refresh token strategy
    if (!req.user) {
      throw new Error('No user found');
    }

    const user = await this.authService.refreshToken(req.user.userId, res);

    return user;
  }

  // logout endpoint
}
