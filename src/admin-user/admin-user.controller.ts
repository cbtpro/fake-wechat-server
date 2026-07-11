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
  Get,
  UseInterceptors,
  Inject,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { plainToClass } from 'class-transformer';
import EncryptionInterceptor from '../interceptor/encryption.interceptor';
import { User } from '../user/entities/user.entity';
import {
  STORAGE_SERVICE_TOKEN,
  StorageService,
} from '../modules/storage/storage.service.interface';

@UseInterceptors(EncryptionInterceptor)
@Controller('/admin/user')
export class AdminUserController {
  constructor(
    private dataSource: DataSource,
    @Inject(STORAGE_SERVICE_TOKEN)
    private readonly storageService: StorageService,
  ) {}

  @Get('/info')
  async getUserInfo(
    @Req() req: Request & { user: { userId: number; username: string } },
  ) {
    const { userId } = req.user;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const user = await queryRunner.manager
        .createQueryBuilder(User, 'user')
        .where('user.id = :id', { id: userId })
        .getOne();
      if (user?.avatar) {
        user.avatar = this.storageService.getUrl(user.avatar);
      }
      return {
        success: true,
        message: '',
        data: plainToClass(User, user),
      } as IResponseBody<User>;
    } finally {
      await queryRunner.release();
    }
  }
}
