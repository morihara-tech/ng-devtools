export type UrlEncoderMode = 'encode' | 'decode';

export type UrlEncoderMethod = 'encodeURI' | 'encodeURIComponent';

export interface UrlEncoderInputModel {
  input: string;
  mode: UrlEncoderMode;
  method: UrlEncoderMethod;
}
