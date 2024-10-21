import { Body, Controller, Get, Headers, Ip, Param, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterByEmailDto } from './dto/registerByEmail.dto.js';
import { DeviceDto } from './dto/device.dto.js';
import { Response } from 'express';
import { MailService } from '../mail/mail.service.js';
import { LoginByEmailDto } from './dto/loginByEmail.dto.js';
import { Cookies } from '../decorators/cookie.decorator.js';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @ApiBadRequestResponse()
  @ApiConflictResponse()
  @ApiCreatedResponse({
    description: 'creates user, returns access and refresh tokens via cookies and sends a confirmation email',
  })
  @ApiBody({ type: RegisterByEmailDto })
  @Post('register/email')
  async registerByEmail(
    @Headers('user-agent') userAgent: string,
    @Body() body: RegisterByEmailDto,
    @Ip() ip: string,
    @Res() res: Response,
  ) {
    const device: DeviceDto = { userAgent, ip };
    const tokens = await this.authService.registerByEmail(body, device);

    await this.mailService.sendUserConfirmation(body.name, body.email);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 1000 * 60 * 15),
    });

    res.status(201).json({ status: 'success' });
  }

  @ApiBadRequestResponse()
  @ApiOkResponse({
    description: 'logging user in and returns access and refresh token via cookies',
  })
  @ApiBody({ type: LoginByEmailDto })
  @Post('login/email')
  async loginByEmail(
    @Body() body: LoginByEmailDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
    @Res() res: Response,
  ) {
    const device: DeviceDto = { userAgent, ip };
    const tokens = await this.authService.loginByEmail(body, device);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 1000 * 60 * 15),
    });

    res.status(201).json({ status: 'success' });
  }

  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiOkResponse({
    description: 'refreshes access token and returns new access and refresh tokens via cookies',
  })
  @Post('refresh')
  async refresh(
    @Cookies('refreshToken') refresh: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
    @Res() res: Response,
  ) {
    const device: DeviceDto = { userAgent, ip };

    const tokens = await this.authService.refresh(refresh, device);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 1000 * 60 * 15),
    });

    res.status(200).json({ status: 'success' });
  }

  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiOkResponse({
    description: 'logs user out from one device',
  })
  @Get('logout/:ip/:userAgent')
  async logoutOneDevice(
    @Cookies('refreshToken') refresh: string | undefined,
    @Param() device: DeviceDto,
    @Res() res: Response,
  ) {
    if (!refresh) {
      res.status(401).json({ status: 'error', message: 'No refresh token provided' });
      return;
    }

    await this.authService.logout(refresh, device);

    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    res.status(200).json({ status: 'success' });
  }

  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiOkResponse({
    description: 'logs user out from all devices',
  })
  @Get('logout')
  async logout(@Cookies('refreshToken') refresh: string, @Res() res: Response) {
    await this.authService.logoutFromAll(refresh);

    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    res.status(200).json({ status: 'success' });
  }
}
