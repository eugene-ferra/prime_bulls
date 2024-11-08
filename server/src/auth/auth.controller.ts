import { Body, Controller, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterByEmailDto } from './dto/registerByEmail.dto.js';
import { DeviceDto } from '../common/dto/device.dto.js';
import { Request, Response } from 'express';
import { MailService } from '../mail/mail.service.js';
import { LoginByEmailDto } from './dto/loginByEmail.dto.js';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshGuard } from '../common/guards/refresh.guard.js';
import { AccessGuard } from '../common/guards/access.guard.js';
import { setAuthCookies } from './helpers/setAuthCookies.js';
import { clearAuthCookies } from './helpers/clearAuthCookies.js';
import { ForgotPasswordDto } from './dto/forgotPassword.dto.js';
import { UserService } from '../user/services/user.service.js';
import { Device } from '../common/decorators/device.decorator.js';
import { ApiSingleResponse } from '../common/decorators/apiSingleResponse.decorator.js';
import { UserEntity } from '../user/entities/user.entity.js';

@ApiTags('auth')
@ApiBadRequestResponse()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  @ApiConflictResponse()
  @ApiSingleResponse(UserEntity)
  @Post('register/email')
  async registerByEmail(@Device() device: DeviceDto, @Body() body: RegisterByEmailDto, @Res() res: Response) {
    const data = await this.authService.registerByEmail(body, device);
    await this.mailService.sendUserConfirmation(body.name, body.email);
    const user = await this.userService.findOne(data.userId);

    setAuthCookies(res, data.tokens);
    res.status(201).json({ status: 'success', body: new UserEntity(user) });
  }

  @ApiSingleResponse(UserEntity)
  @Post('login/email')
  async loginByEmail(@Body() body: LoginByEmailDto, @Device() device: DeviceDto, @Res() res: Response) {
    const data = await this.authService.loginByEmail(body, device);
    const user = await this.userService.findOne(data.userId);

    setAuthCookies(res, data.tokens);
    res.status(201).json({ status: 'success', body: new UserEntity(user) });
  }

  @ApiUnauthorizedResponse()
  @ApiOkResponse()
  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: Request, @Device() device: DeviceDto, @Res() res: Response) {
    const tokens = await this.authService.refresh(req.user.id, device);

    setAuthCookies(res, tokens);
    res.status(200).json({ status: 'success' });
  }

  @ApiOkResponse()
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const { email } = body;
    const { token, expiredAt } = await this.userService.getResetToken(email);

    await this.mailService.sendForgotPassword(email, token, expiredAt);
  }

  @ApiSingleResponse(UserEntity)
  @Patch('reset-password/:token')
  async resetPassword(@Param('token') token: string, @Body() body: LoginByEmailDto) {
    await this.userService.resetPassword(body.email, token, body.password);

    const user = await this.userService.findByEmail(body.email);

    return new UserEntity(user);
  }

  @ApiUnauthorizedResponse()
  @ApiOkResponse()
  @UseGuards(AccessGuard)
  @Get('logout/:ip/:userAgent')
  async logoutOneDevice(@Req() req: Request, @Param() device: DeviceDto, @Res() res: Response) {
    await this.authService.logout(req.user.id, device);

    if (device.ip === req.ip && device.userAgent === req.headers['user-agent']) clearAuthCookies(res);

    res.status(200).json({ status: 'success' });
  }

  @ApiUnauthorizedResponse()
  @ApiOkResponse()
  @UseGuards(AccessGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logoutFromAll(req.user.id);

    clearAuthCookies(res);
    res.status(200).json({ status: 'success' });
  }
}
