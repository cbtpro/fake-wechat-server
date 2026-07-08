export interface RegisterDto {
  username: string;
  nickname: string;
  password: string;
  avatar?: string;
  captcha: string;
  captchaId: string;
}
