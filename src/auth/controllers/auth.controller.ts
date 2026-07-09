import { Controller, Post, Body, UseInterceptors, Inject } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { SkipAuth } from '../../common/decorators/skip-auth.decorator';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import EncryptionInterceptor from '../../interceptor/encryption.interceptor';
import { crypt } from '../../common/utils/bcrypt';
import { ForbiddenException } from '../../common/exceptions/forbidden.exception';
import { UserService } from '../../user/user.service';
import { CaptchaCacheService } from '../../captcha/services/captcha-cache.service';
import {
  STORAGE_SERVICE_TOKEN,
  StorageService,
} from '../../modules/storage/storage.service.interface';

@UseInterceptors(EncryptionInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly captchaCacheService: CaptchaCacheService,
    @Inject(STORAGE_SERVICE_TOKEN)
    private readonly storageService: StorageService,
  ) {}

  private verifyCaptcha(captchaId: string, captcha: string): void {
    const cacheKey = `${captchaId}_captcha`;
    const storedCode = this.captchaCacheService.get(cacheKey);

    if (!storedCode) {
      throw new ForbiddenException('验证码已过期');
    }

    if (storedCode.toLowerCase() !== captcha.toLowerCase()) {
      throw new ForbiddenException('验证码错误');
    }

    this.captchaCacheService.delete(cacheKey);
  }

  @SkipAuth()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    this.verifyCaptcha(loginDto.captchaId, loginDto.captcha);

    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    const authInfo = await this.authService.login(user);
    if (authInfo.user?.avatar) {
      authInfo.user.avatar = this.storageService.getUrl(authInfo.user.avatar);
    }
    const responseBody: IResponseBody<IAuthInfo> = {
      success: true,
      message: '登录成功！',
      data: authInfo,
    };
    return responseBody;
  }

  @SkipAuth()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    this.verifyCaptcha(registerDto.captchaId, registerDto.captcha);

    try {
      const password = await crypt(registerDto.password);
      const userData = Object.assign(registerDto, { password });
      const isExist = await this.userService.findUserCountByUsername(registerDto.username);
      if (!isExist) {
        const newUser = await this.userService.registerNewUser(userData);
        const responseBody: IResponseBody<any> = {
          success: true,
          message: '注册成功！',
          data: newUser,
        };
        return responseBody;
      } else {
        throw new ForbiddenException('用户名已存在');
      }
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
