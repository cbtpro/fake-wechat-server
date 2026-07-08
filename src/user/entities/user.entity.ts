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

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('t_user')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    unique: true,
  })
  username: string;

  @Column()
  nickname: string;

  @Column({
    default: '',
  })
  avatar: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  password?: string;

  @Column({
    default: true,
  })
  isEnabled: boolean;

  @CreateDateColumn()
  createDate?: Date;

  @UpdateDateColumn()
  updateDate?: Date;
}
