export interface ApiKeyGenInputModel {
  format: ApiKeyFormat;
  length: number;
  count: number;
  prefix: string;
}

export type ApiKeyFormat = 'base62' | 'hex' | 'uuid-v4';
