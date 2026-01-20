export interface SqlFormatterInputModel {
  indentSpaceSize: number;
  mode: 'standard' | 'tabularLeft' | 'minify';
  keywordCase: 'upper' | 'lower' | 'preserve';
  identifierCase: 'upper' | 'lower' | 'preserve';
}
