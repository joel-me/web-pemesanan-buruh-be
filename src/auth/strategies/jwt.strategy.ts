import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport'; // Gunakan PassportStrategy
import { ExtractJwt, Strategy } from 'passport-jwt'; // Gunakan Strategy dari passport-jwt
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { UserType } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { // Gunakan PassportStrategy dengan Strategy
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const { username, sub, role } = payload; // Ubah userType menjadi role
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }
    return { userId: sub, username, role }; // Ubah userType menjadi role
  }
}
