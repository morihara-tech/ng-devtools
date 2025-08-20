export interface UuidGenInputModel {
  generatingSize: number;
  version: UuidVersion;
}

export type UuidVersion = 'v1' | 'v4' | 'v7';
