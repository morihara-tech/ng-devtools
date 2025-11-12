export interface JsonFormatterInputModel {
  indentSpaceSize: number;
  mode: 'format' | 'minify';
  isEscapeMode: boolean;
  jsonString: string;
}
