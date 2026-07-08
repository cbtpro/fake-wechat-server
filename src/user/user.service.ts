// Copyright 2023 Peter Chen
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
import { plainToClass } from 'class-transformer';
import { User } from './entities/user.entity';
import { ForbiddenException } from '../common/exceptions/forbidden.exception';

@Injectable()
export class UserService {
  private dataSource: DataSource;
  constructor(private ds: DataSource) {
    this.dataSource = ds;
  }
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * 判断用户名是否存在
   * @param username 用户名
   * @returns 是否存在用户
   */
  async findUserCountByUsername(username: string): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const count = await queryRunner.manager
        .createQueryBuilder(User, 'user')
        .where('user.username = :username', { username: username })
        .getCount();
      return count > 0;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
    return false;
  }
  async registerNewUser(user: IUser): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newUser = await queryRunner.manager.save(User, user);
      await queryRunner.commitTransaction();
      // 返回前转换下，去除密码
      return plainToClass(User, newUser);
    } catch (error) {
      console.error(error);
      // 如果遇到错误，可以回滚事务
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException(error.message);
    } finally {
      // 你需要手动实例化并部署一个queryRunner
      await queryRunner.release();
    }
  }
}
