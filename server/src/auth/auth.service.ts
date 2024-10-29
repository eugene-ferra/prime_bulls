import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { TokensDto } from './dto/tokens.dto.js';
import { RegisterByEmailDto } from './dto/registerByEmail.dto.js';
import { LoginByEmailDto } from './dto/loginByEmail.dto.js';
import { DeviceDto } from '../common/dto/device.dto.js';
import { SessionService } from './session.service.js';
import { TokenService } from './token.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async registerByEmail(data: RegisterByEmailDto, device: DeviceDto): Promise<TokensDto> {
    const { id, role } = await this.userService.create(data);
    const { accessToken, refreshToken } = await this.tokenService.generateTokens({ id, role });
    await this.sessionService.saveSession(id, refreshToken, device);

    return { accessToken, refreshToken };
  }

  async loginByEmail(data: LoginByEmailDto, device: DeviceDto): Promise<TokensDto> {
    const { email, password } = data;
    const user = await this.userService.findByEmail(email);
    const isPasswordCorrect = await this.userService.isCorrectPassword(password, user.password);

    if (!user || !isPasswordCorrect) throw new BadRequestException('Неправильний email або пароль!');

    const { accessToken, refreshToken } = await this.tokenService.generateTokens({
      id: user.id,
      role: user.role,
    });
    await this.sessionService.saveSession(user.id, refreshToken, device);

    return { accessToken, refreshToken };
  }

  async refresh(userId: number, device: DeviceDto): Promise<TokensDto> {
    const { id, role } = await this.userService.findById(userId);
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
