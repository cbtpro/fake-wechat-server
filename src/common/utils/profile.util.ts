import { Provider, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getProfile } from '../decorators/profile.decorator';

interface ProfileProviderConfig {
  provide: any;
  useClasses: Type<any>[];
}

export const createProfileProvider = (
  config: ProfileProviderConfig,
): Provider => {
  return {
    provide: config.provide,
    useFactory: (configService: ConfigService) => {
      const currentProfile = configService.get('NODE_ENV') || 'production';
      
      for (const useClass of config.useClasses) {
        const profile = getProfile(useClass);
        
        if (!profile) {
          return new useClass(configService);
        }
        
        const profiles = Array.isArray(profile) ? profile : [profile];
        if (profiles.includes(currentProfile)) {
          return new useClass(configService);
        }
      }
      
      const fallback = config.useClasses[config.useClasses.length - 1];
      return new fallback(configService);
    },
    inject: [ConfigService],
  };
};
