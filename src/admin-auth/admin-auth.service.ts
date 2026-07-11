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

import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { User } from '../user/entities/user.entity';
import { comparePassword } from '../common/utils/bcrypt';
import { ForbiddenException } from '../common/exceptions/forbidden.exception';

@Injectable()
export class AdminAuthService {
  constructor(
    private dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const user = await queryRunner.manager
        .createQueryBuilder(User, 'user')
        .where('user.username = :username', { username })
        .getOne();
      if (!user) {
        throw new ForbiddenException('用户名或密码错误');
      }
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        throw new ForbiddenException('用户名或密码错误');
      }
      return plainToClass(User, user);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    const decoded = this.jwtService.decode(access_token) as { exp: number };
    return {
      access_token,
      expires_at: decoded.exp ? decoded.exp * 1000 : Date.now() + 7 * 24 * 60 * 60 * 1000,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
      },
    } as IAuthInfo;
  }
}
