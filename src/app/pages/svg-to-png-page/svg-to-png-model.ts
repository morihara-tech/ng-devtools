export interface SvgToPngSettingsModel {
  canvasWidth: number;
  canvasHeight: number;
  transparent: boolean;
  backgroundColor: string;
  scale: number;
  offsetX: number;
  offsetY: number;
}

export const DEFAULT_SVG_TO_PNG_SETTINGS: SvgToPngSettingsModel = {
  canvasWidth: 256,
  canvasHeight: 256,
  transparent: false,
  backgroundColor: '#ffffff',
  scale: 100,
  offsetX: 28,
  offsetY: 28,
};
