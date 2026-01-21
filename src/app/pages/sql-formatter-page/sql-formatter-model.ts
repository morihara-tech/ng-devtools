export interface SqlFormatterInputModel {
  indentSpaceSize: number;
  mode: 'standard' | 'tabularRight' | 'minify';
  keywordCase: 'upper' | 'lower' | 'preserve';
  identifierCase: 'upper' | 'lower' | 'preserve';
}
