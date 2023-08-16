import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async register(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hash },
      select: { email: true, createdAt: true },
    });
    return user;
  }
  async login(dto: AuthDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
      select: { email: true, password: true, id: true },
    });
    if (!user) throw new UnauthorizedException('wrong email/password!');
    const isValidPassword = await argon.verify(user.password, dto.password);
    if (!isValidPassword)
      throw new UnauthorizedException('wrong email/password!');

    return this.signToken(user.id, user.email);
  }

  async signToken(id: number, email: string): Promise<{ token: string }> {
    const secret = this.config.get('SECRET_KEY');
    const issuer = this.config.get('ISSUER');
    const payload = {
      id,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      secret,
      expiresIn: '10h',
      issuer,
    });
    return { token };
  }
}
