import { Body, Controller, Get, Headers, Ip, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterByEmailDto } from './dto/registerByEmail.dto.js';
import { DeviceDto } from './dto/device.dto.js';
import { Response } from 'express';
import { MailService } from '../mail/mail.service.js';
import { LoginByEmailDto } from './dto/loginByEmail.dto.js';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshGuard } from '../guards/refresh.guard.js';
import { AccessGuard } from '../guards/access.guard.js';

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
  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(
    @Req() req,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
    @Res() res: Response,
  ) {
    const device: DeviceDto = { userAgent, ip };

    const tokens = await this.authService.refresh(req.user.id, device);

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
  @UseGuards(AccessGuard)
  @Get('logout/:ip/:userAgent')
  async logoutOneDevice(@Req() req, @Param() device: DeviceDto, @Res() res: Response) {
    await this.authService.logout(req.user.id, device);

    if (device.ip === req.ip && device.userAgent === req.headers['user-agent']) {
      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');
    }

    res.status(200).json({ status: 'success' });
  }

  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiOkResponse({
    description: 'logs user out from all devices',
  })
  @UseGuards(AccessGuard)
  @Get('logout')
  async logout(@Req() req, @Res() res: Response) {
    await this.authService.logoutFromAll(req.user.id);

    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    res.status(200).json({ status: 'success' });
  }
}
