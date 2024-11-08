import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/services/user.service.js';
import { TokensDto } from './dto/tokens.dto.js';
import { RegisterByEmailDto } from './dto/registerByEmail.dto.js';
import { LoginByEmailDto } from './dto/loginByEmail.dto.js';
import { DeviceDto } from '../common/dto/device.dto.js';
import { SessionRepository } from './services/session.service.js';
import { TokenService } from './services/token.service.js';
import { AuthData } from './types/auth.type.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionService: SessionRepository,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async registerByEmail(data: RegisterByEmailDto, device: DeviceDto): Promise<AuthData> {
    const { id, role } = await this.userService.create(data);

    const { accessToken, refreshToken } = await this.tokenService.generateTokens({ id, role });
    await this.sessionService.saveSession(id, refreshToken, device);

    return { tokens: { accessToken, refreshToken }, userId: id };
  }

  async loginByEmail(data: LoginByEmailDto, device: DeviceDto): Promise<AuthData> {
    const { email, password } = data;
    const user = await this.userService.findByEmail(email);

    const isPasswordCorrect = await this.userService.isPasswordCorrect(password, user.password);

    if (!user || !isPasswordCorrect) throw new BadRequestException('Неправильний email або пароль!');
    const { id, role } = user;

    const { accessToken, refreshToken } = await this.tokenService.generateTokens({ id, role });
    await this.sessionService.saveSession(user.id, refreshToken, device);

    return { tokens: { accessToken, refreshToken }, userId: user.id };
  }

  async refresh(userId: number, device: DeviceDto): Promise<TokensDto> {
    const { id, role } = await this.userService.findOne(userId);
    const tokens = await this.tokenService.generateTokens({ id, role });
    await this.sessionService.saveSession(id, tokens.refreshToken, device);

    return tokens;
  }

  async logout(userId: number, device: DeviceDto) {
    await this.sessionService.removeSession(userId, device);
  }

  async logoutFromAll(userId: number) {
    await this.sessionService.removeAllSessions(userId);
  }
}
