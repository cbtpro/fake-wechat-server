// Copyright 2024 Peter Chen
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { SkipAuth } from '../common/decorators/skip-auth.decorator';
import EncryptionInterceptor from '../interceptor/encryption.interceptor';
import { AdminAuthService } from './admin-auth.service';
import {
  STORAGE_SERVICE_TOKEN,
  StorageService,
} from '../modules/storage/storage.service.interface';

interface IAdminLoginDto {
  username: string;
  password: string;
}

@UseInterceptors(EncryptionInterceptor)
@Controller('/admin/auth')
export class AdminAuthController {
  constructor(
    private readonly adminAuthService: AdminAuthService,
    @Inject(STORAGE_SERVICE_TOKEN)
    private readonly storageService: StorageService,
  ) {}

  @SkipAuth()
  @Post('/login')
  async login(@Body() loginDto: IAdminLoginDto) {
    const user = await this.adminAuthService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    const authInfo = await this.adminAuthService.login(user);
    if (authInfo.user?.avatar) {
      authInfo.user.avatar = this.storageService.getUrl(authInfo.user.avatar);
    }
    return {
      success: true,
      message: '登录成功',
      data: authInfo,
    } as IResponseBody<IAuthInfo>;
  }

  @Post('/logout')
  async logout() {
    return {
      success: true,
      message: '退出成功',
      data: null,
    } as IResponseBody<null>;
  }

  @Get('/codes')
  async getAccessCodes() {
    return {
      success: true,
      message: '',
      data: ['*'],
    } as IResponseBody<string[]>;
  }
}
