export interface TextDiffInputModel {
  original: string;
  modified: string;
}

export interface TextDiffResult {
  originalValue: string;
  modifiedValue: string;
  originalRowHighlights: Record<number, string>;
  modifiedRowHighlights: Record<number, string>;
}
