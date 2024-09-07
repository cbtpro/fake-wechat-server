import {
  Controller,
  Body,
  Get,
  Request,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import EncryptionInterceptor from '@/interceptor/encryption.interceptor';
import { AppService } from './app.service';
// import { plainToClass } from 'class-transformer';
// import { User } from './user/user.entity';
// import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { SkipAuth } from './auth/auth.decorator';

@UseInterceptors(EncryptionInterceptor)
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @SkipAuth()
  // @UseGuards(LocalAuthGuard)
  // @UseGuards(AuthGuard('local'))
  @Post('/auth/login')
  async login(@Body() user: IUser) {
    const authInfo = await this.authService.login(user);
    const responseBody: IResponseBody<IAuthInfo> = {
      success: true,
      message: '成功！',
      data: authInfo,
    };
    return responseBody;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
