import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { TokensDto } from './dto/tokens.dto.js';
import { RegisterByEmailDto } from './dto/registerByEmail.dto.js';
import { LoginByEmailDto } from './dto/loginByEmail.dto.js';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadDto } from './dto/tokenPayload.dto.js';
import { PrismaService } from '../prisma-service/prisma-service.service.js';
import { DeviceDto } from './dto/device.dto.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async registerByEmail(data: RegisterByEmailDto, device: DeviceDto): Promise<TokensDto> {
    const { id, role } = await this.userService.create(data);
    const { accessToken, refreshToken } = await this.generateTokens({ id, role });
    await this.saveSession(id, refreshToken, device);

    return { accessToken, refreshToken };
  }

  async loginByEmail(data: LoginByEmailDto, device: DeviceDto): Promise<TokensDto> {
    const { email, password } = data;
    const user = await this.userService.findByEmail(email);
    const isPasswordCorrect = await this.userService.isCorrectPassword(password, user.password);

    if (!user || !isPasswordCorrect) throw new BadRequestException('Неправильний email або пароль!');

    const { accessToken, refreshToken } = await this.generateTokens({ id: user.id, role: user.role });
    await this.saveSession(user.id, refreshToken, device);

    return { accessToken, refreshToken };
  }

  private async generateTokens(payload: TokenPayloadDto): Promise<TokensDto> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: '21d',
    });

    return { accessToken, refreshToken };
  }

  private async saveSession(userId: number, token: string, device: DeviceDto) {
    const session = await this.prisma.token.findFirst({
      where: { userId, ip: device.ip, userAgent: device.userAgent },
    });

    if (session) return;

    await this.prisma.token.create({
      data: { userId, token, ...device },
    });
  }

  private async removeSession(userId: number, device: DeviceDto) {
    const session = await this.prisma.token.findFirst({
      where: { userId: userId, ip: device.ip, userAgent: device.userAgent },
    });

    if (!session) throw new BadRequestException('Сесію не знайдено!');

    await this.prisma.token.delete({ where: { id: session.id } });
  }

  private async removeAllSessions(userId: number) {
    await this.prisma.token.deleteMany({ where: { userId } });
  }

  async refresh(userId: number, device: DeviceDto): Promise<TokensDto> {
    const { id, role } = await this.userService.findById(userId);
    const tokens = await this.generateTokens({ id, role });
    await this.saveSession(id, tokens.refreshToken, device);

    return tokens;
  }

  async logout(userId: number, device: DeviceDto) {
    await this.removeSession(userId, device);
  }

  async logoutFromAll(userId: number) {
    await this.removeAllSessions(userId);
  }
}
