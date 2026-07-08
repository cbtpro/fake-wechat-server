import { Controller, Get, UseInterceptors } from '@nestjs/common';
import EncryptionInterceptor from '@/interceptor/encryption.interceptor';
import { AppService } from './app.service';

@UseInterceptors(EncryptionInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
