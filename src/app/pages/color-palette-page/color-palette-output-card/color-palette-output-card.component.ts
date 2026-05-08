import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { RevoGrid } from '@revolist/angular-datagrid';
import { CellTemplate, ColumnRegular } from '@revolist/revogrid';
import { PlatformService } from '../../../core/services/platform.service';
import {
  ColorPaletteInputModel,
  ColorPaletteMode,
  SHADE_STEPS,
  generateMaterialShades,
  getTextColorForBackground,
} from '../color-palette-model';

@Component({
  selector: 'app-color-palette-output-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    HeadingComponent,
    RevoGrid,
  ],
  templateUrl: './color-palette-output-card.component.html',
  styleUrl: './color-palette-output-card.component.scss',
})
export class ColorPaletteOutputCardComponent implements OnInit, OnDestroy {
  gridSource: Record<string, unknown>[] = [];
  columns: ColumnRegular[] = [];
  theme: 'compact' | 'darkCompact' = 'compact';
  currentMode = signal<ColorPaletteMode>('compare');
  currentColors = signal<string[]>([]);

  private mediaQueryList: MediaQueryList | null = null;
  private readonly themeListener = (e: MediaQueryListEvent) => this.updateTheme(e.matches);

  private readonly snackBar = inject(MatSnackBar);
  private readonly platformService = inject(PlatformService);

  ngOnInit(): void {
    this.mediaQueryList = this.platformService.matchMedia('(prefers-color-scheme: dark)');
    this.updateTheme(this.mediaQueryList?.matches ?? false);
    this.mediaQueryList?.addEventListener('change', this.themeListener);
  }

  ngOnDestroy(): void {
    this.mediaQueryList?.removeEventListener('change', this.themeListener);
  }

  /**
   * Updates the grid data and column definitions based on the input model.
   * Called by the parent page component when the user clicks Generate.
   */
  renderPalette(input: ColorPaletteInputModel): void {
    this.currentMode.set(input.mode);
    this.currentColors.set(input.colors);
    if (input.mode === 'compare') {
      this.buildCompareGrid(input.colors);
    } else {
      this.buildShadesGrid(input.colors);
    }
  }

  /** Exports the current shades grid as CSS custom properties to clipboard. */
  onClickExport(): void {
    const colors = this.currentColors();
    if (colors.length === 0) return;

    const lines: string[] = [];
    colors.forEach((baseHex, idx) => {
      const shades = generateMaterialShades(baseHex);
      SHADE_STEPS.forEach(step => {
        const varName = colors.length > 1
          ? `--color-${idx + 1}-${step}`
          : `--color-primary-${step}`;
        lines.push(`${varName}: ${shades[step]};`);
      });
      if (idx < colors.length - 1) lines.push('');
    });

    this.copyText(lines.join('\n'));
  }

  private buildCompareGrid(colors: string[]): void {
    const previewCellTemplate = this.createPreviewCellTemplate();

    this.columns = [
      {
        prop: 'index',
        name: $localize`:@@page.colorPalette.card.output.grid.columnIndex:#`,
        readonly: true,
        size: 60,
      },
      {
        prop: 'hex',
        name: $localize`:@@page.colorPalette.card.output.grid.columnHex:カラーコード`,
        readonly: true,
        size: 160,
      },
      {
        prop: 'preview',
        name: $localize`:@@page.colorPalette.card.output.grid.columnPreview:プレビュー`,
        readonly: true,
        size: 120,
        cellTemplate: previewCellTemplate,
      },
    ];

    this.gridSource = colors.map((hex, i) => ({
      index: i + 1,
      hex,
      preview: hex,
    }));
  }

  private buildShadesGrid(colors: string[]): void {
    const colorCellTemplate = this.createColorCellTemplate();
    const colorColumns: ColumnRegular[] = colors.map((hex, i) => ({
      prop: `color${i}`,
      name: hex,
      readonly: true,
      size: 140,
      cellTemplate: colorCellTemplate,
    }));

    this.columns = [
      {
        prop: 'step',
        name: $localize`:@@page.colorPalette.card.output.grid.columnStep:ステップ`,
        readonly: true,
        size: 80,
      },
      ...colorColumns,
    ];

    this.gridSource = SHADE_STEPS.map(step => {
      const row: Record<string, unknown> = { step };
      colors.forEach((hex, i) => {
        const shades = generateMaterialShades(hex);
        row[`color${i}`] = shades[step];
      });
      return row;
    });
  }

  /**
   * Creates a RevoGrid custom cell template that renders a background-only color cell
   * for compare-mode preview cells.
   */
  private createPreviewCellTemplate(): CellTemplate {
    return (h, props) => {
      const hex = String(props.model[props.prop] ?? '');
      const isHexColor = hex.startsWith('#');
      return h(
        'div',
        {
          style: {
            backgroundColor: isHexColor ? hex : 'var(--mat-sys-surface-variant)',
            border: '1px solid var(--mat-sys-outline-variant)',
            borderRadius: '4px',
            height: '100%',
            width: '100%',
            boxSizing: 'border-box',
          },
        },
        '',
      );
    };
  }

  /**
   * Creates a RevoGrid custom cell template that renders each hex color
   * as a colored cell with auto-contrasted text and a click-to-copy action.
   */
  private createColorCellTemplate(): CellTemplate {
    return (h, props) => {
      const hex = String(props.model[props.prop] ?? '');
      if (!hex.startsWith('#')) {
        return h('span', {}, hex);
      }
      const textColor = getTextColorForBackground(hex);
      return h(
        'div',
        {
          style: {
            backgroundColor: hex,
            color: textColor,
            cursor: 'pointer',
            padding: '0 8px',
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box',
          },
          onClick: () => this.copyHexColor(hex),
        },
        hex,
      );
    };
  }

  private copyHexColor(hex: string): void {
    const message = $localize`:@@page.colorPalette.card.output.copied:${hex}:hex: をコピーしました`;
    this.copyText(hex, message);
  }

  private copyText(text: string, successMessage?: string): void {
    if (!this.platformService.isBrowser() || !navigator.clipboard) {
      this.snackBar.open(
        $localize`:@@common.copyError:コピーに失敗しました。`,
        $localize`:@@common.ok:はい`,
        { duration: 2000, horizontalPosition: 'start' },
      );
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      const message = successMessage ?? $localize`:@@common.copiedMessage:コピーしました。`;
      this.snackBar.open(message, $localize`:@@common.ok:はい`, {
        duration: 2000,
        horizontalPosition: 'start',
      });
    }).catch(() => {
      this.snackBar.open(
        $localize`:@@common.copyError:コピーに失敗しました。`,
        $localize`:@@common.ok:はい`,
        { duration: 2000, horizontalPosition: 'start' },
      );
    });
  }

  private updateTheme(isDark: boolean): void {
    this.theme = isDark ? 'darkCompact' : 'compact';
  }
}
