export const PROFILE_METADATA_KEY = 'profile';

export const Profile = (profile: string | string[]) => {
  return (target: any) => {
    Reflect.defineMetadata(PROFILE_METADATA_KEY, profile, target);
  };
};

export const getProfile = (target: any): string | string[] | undefined => {
  return Reflect.getMetadata(PROFILE_METADATA_KEY, target);
};
