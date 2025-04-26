import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import UserLoginDto from './dto/user_login.dto';
import UserLoginViewDto from './dto/login_view.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from 'src/guards/jwt-refresh.guard';

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
  @UseGuards(JwtRefreshAuthGuard)
  @Post('/refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserLoginViewDto> {
    // req.user is populated by the refresh token strategy
    if (!req.user) {
      throw new BadRequestException('No user found');
    }

    const user = await this.authService.refreshToken(req.user.userId, res);

    return user;
  }

  // logout endpoint
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    // req.user is populated by the JWT strategy
    if (!req.user) {
      throw new BadGatewayException('No user found');
    }

    await this.authService.logout(req.user.userId, res);
  }
}
