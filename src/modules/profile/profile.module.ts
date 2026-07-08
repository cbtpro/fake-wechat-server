import { Module, DynamicModule, Provider, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PROFILE_METADATA_KEY } from '../../common/decorators/profile.decorator';

interface ProfileProvider {
  provide: any;
  useClass: Type<any>;
}

@Module({})
export class ProfileModule {
  static forProviders(providers: ProfileProvider[]): DynamicModule {
    return {
      module: ProfileModule,
      providers: providers,
      exports: providers.map(p => p.provide),
    };
  }

  static registerProfileProviders(providers: { provide: any; useClass: Type<any> }[]): DynamicModule {
    return {
      module: ProfileModule,
      providers: providers.map(provider => ({
        provide: provider.provide,
        useFactory: (configService: ConfigService) => {
          const currentProfile = configService.get('NODE_ENV') || 'production';
          const profile = Reflect.getMetadata(PROFILE_METADATA_KEY, provider.useClass);
          
          if (!profile) {
            return new provider.useClass(configService);
          }
          
          const profiles = Array.isArray(profile) ? profile : [profile];
          if (profiles.includes(currentProfile)) {
            return new provider.useClass(configService);
          }
          
          return null;
        },
        inject: [ConfigService],
      })),
      exports: providers.map(p => p.provide),
    };
  }
}
