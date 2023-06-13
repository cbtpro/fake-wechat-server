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

import { Body, Controller, Get, Post } from '@nestjs/common';
import { crypt } from '../utils/bcrypt';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/test')
  getHello(): string {
    return this.userService.getHello();
  }

  @Post('/register')
  async register(@Body() user: IUser): Promise<IResponseBody<User>> {
    try {
      const password = await crypt(user.password);
      const cryptUser = Object.assign(user, { password });
      const newUser = await this.userService.registerNewUser(cryptUser);
      const responseBody: IResponseBody<User> = {
        success: true,
        message: '注册成功！',
        data: newUser,
      };
      return responseBody;
    } catch (error) {
      console.error(error);
      const responseBody: IResponseBody<User> = {
        success: false,
        message: error.message,
        data: null,
      };
      return responseBody;
    }
  }

  // @Post('/login')
  // async login(@Body() user: IUser): Promise<IResponseBody<User>> {
  //   const { username, password } = user;
  //   try {
  //     const userInfo = await this.userService.validateUser(username, password);
  //     const responseBody: IResponseBody<User> = {
  //       success: true,
  //       message: '登录成功！',
  //       data: userInfo,
  //     };
  //     return responseBody;
  //   } catch (error) {
  //     console.error(error);
  //     const responseBody: IResponseBody<User> = {
  //       success: false,
  //       message: error.message,
  //       data: null,
  //     };
  //     return responseBody;
  //   }
  // }
}
