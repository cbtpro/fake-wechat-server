export const CAPTCHA_SERVICE_TOKEN = 'CAPTCHA_SERVICE';

export interface CaptchaService {
  generateCaptcha(): { code: string; image: string };
  validateCaptcha(key: string, code: string): boolean;
}
