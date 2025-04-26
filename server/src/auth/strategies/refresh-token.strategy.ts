// refresh-token.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req && req.cookies) return req.cookies['refresh_token'];
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESHTOKEN_SECRET') || '',
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: any,
  ): Promise<{ userId: string; email: string }> {
    const refreshToken = req.cookies?.['refresh_token'];
    if (!refreshToken)
      throw new UnauthorizedException('No refresh token found');

    return { userId: payload.sub, email: payload.email };
  }
}
