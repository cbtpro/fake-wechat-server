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
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum SplashType {
  SPLASH = 'SPLASH',
  AD = 'AD',
}

export enum SplashStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum SplashTheme {
  ALL = 'ALL',
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

@Entity('splash_config')
export class SplashConfig {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    length: 32,
    default: SplashType.SPLASH,
  })
  @Index()
  type: SplashType;

  @Column({
    length: 255,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  content: string;

  @Column({
    length: 512,
    nullable: true,
  })
  imageUrl: string;

  @Column({
    length: 512,
    nullable: true,
  })
  linkUrl: string;

  @Column({
    type: 'int',
    default: 3,
  })
  duration: number;

  @Column({
    type: 'int',
    default: 0,
  })
  @Index()
  sortOrder: number;

  @Column({
    length: 32,
    default: SplashStatus.ACTIVE,
  })
  @Index()
  status: SplashStatus;

  @Column({
    length: 32,
    default: SplashTheme.ALL,
  })
  @Index()
  theme: SplashTheme;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  startTime: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  endTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
