import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import UserLoginDto from './dto/user_login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/User.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import UserLoginViewDto from './dto/login_view.dto';
import { throws } from 'assert';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private readonly logger = new Logger(AuthService.name, {
    timestamp: true,
  });

  async validateUser(loginDto: UserLoginDto): Promise<UserDocument> {
    const { email, password } = loginDto;
    const lowercasedEmail = email.toLowerCase();

    // check if user exists
    const existingUser = await this.userModel
      .findOne({
        email: lowercasedEmail,
      })
      .select('+password');

    if (!existingUser) {
      throw new BadRequestException('user with this email does not exist');
    }

    // check if password is correct
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      this.logger.error(
        `User with email ${lowercasedEmail} tried to login with wrong password`,
      );
      throw new BadRequestException('Wrong password');
    }

    return existingUser;
  }

  async login(user: UserDocument, res: Response) {
    const payload = { sub: user._id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: this.configService.get<string>('JWT_ACCESSTOKEN_SECRET'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESHTOKEN_SECRET'),
      expiresIn: '7d',
    });

    // save refresh token to user db
    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken,
    });

    // Save refresh token in cookie HTTP only for CSRF protection
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true, // true in production (HTTPS)
      sameSite: 'strict',
      path: '/auth/refresh-token',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    this.logger.log(
      `User with email ${user.email} logged in successfully. Access token: ${accessToken}`,
    );
    this.logger.log(
      `User with email ${user.email} logged in successfully. Refresh token: ${refreshToken}`,
    );

    return {
      accessToken,
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async refreshToken(userId: string, res: Response): Promise<UserLoginViewDto> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new BadRequestException('user not found');
    }

    if (!user.refreshToken) {
      this.logger.error(
        `User with email ${user.email} tried to refresh token but refresh token is not found`,
      );
      throw new BadRequestException('user refresh token not found');
    }

    const payload = { sub: user._id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: this.configService.get<string>('JWT_ACCESSTOKEN_SECRET'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESHTOKEN_SECRET'),
      expiresIn: '7d',
    });

    // save refresh token to user db
    await this.userModel.findByIdAndUpdate(user._id, {
      refreshToken,
    });

    // Save refresh token in cookie HTTP only for CSRF protection
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true, // true in production (HTTPS)
      sameSite: 'strict', // CSRF protection
      path: '/auth/refresh-token', // Specify the path for the cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      accessToken,
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async logout(userId: string, res: Response): Promise<void> {
    // Clear the refresh token from the user document
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: null,
    });
    this.logger.log(`User with id ${userId} logged out successfully`);

    // Clear the refresh token cookie
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true, // true in production (HTTPS)
      sameSite: 'strict', // CSRF protection
      path: '/auth/refresh-token', // Specify the path for the cookie
    });

    this.logger.log(
      `User with id ${userId} logged out successfully. Refresh token cleared`,
    );
  }
}
