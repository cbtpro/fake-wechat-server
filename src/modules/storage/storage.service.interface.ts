export const STORAGE_SERVICE_TOKEN = 'STORAGE_SERVICE';

export interface IUploadFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  fieldname?: string;
  encoding?: string;
}

export interface IUploadResult {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

export interface StorageService {
  upload(file: IUploadFile, prefix?: string): Promise<IUploadResult>;
  delete(filename: string): Promise<boolean>;
  getUrl(filename: string): string;
}

