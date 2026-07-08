import { Controller, Get, UseInterceptors } from '@nestjs/common';
import EncryptionInterceptor from '@/interceptor/encryption.interceptor';
import { UserService } from './user.service';
import { SkipAuth } from '../common/decorators/skip-auth.decorator';

@UseInterceptors(EncryptionInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @SkipAuth()
  @Get('test')
  getHello(): string {
    return this.userService.getHello();
  }
}
