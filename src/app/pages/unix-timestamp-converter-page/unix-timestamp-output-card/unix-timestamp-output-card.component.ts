import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RevoGrid } from '@revolist/angular-datagrid';
import { ColumnRegular } from '@revolist/revogrid';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { UnixTimestampInputModel, UnixTimestampResult } from '../unix-timestamp-model';
import { UnixTimestampService } from '../unix-timestamp.service';

interface GridRow {
  name: string;
  value: string;
}

@Component({
  selector: 'app-unix-timestamp-output-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    HeadingComponent,
    RevoGrid,
  ],
  templateUrl: './unix-timestamp-output-card.component.html',
  styleUrl: './unix-timestamp-output-card.component.scss',
})
export class UnixTimestampOutputCardComponent implements OnInit, OnDestroy {
  result?: UnixTimestampResult;
  gridSource: GridRow[] = [];
  theme: 'compact' | 'darkCompact' = 'compact';

  columns: ColumnRegular[] = [
    {
      prop: 'name',
      name: $localize`:@@page.unixTimestamp.card.output.grid.columnName:項目`,
      readonly: true,
      size: 220,
    },
    {
      prop: 'value',
      name: $localize`:@@page.unixTimestamp.card.output.grid.columnValue:値`,
      readonly: true,
      size: 360,
    },
  ];

  private readonly snackBar = inject(MatSnackBar);
  private readonly converterService = inject(UnixTimestampService);
  private readonly mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  private readonly themeListener = (e: MediaQueryListEvent) => this.updateTheme(e.matches);

  ngOnInit(): void {
    this.updateTheme(this.mediaQueryList.matches);
    this.mediaQueryList.addEventListener('change', this.themeListener);
  }

  ngOnDestroy(): void {
    this.mediaQueryList.removeEventListener('change', this.themeListener);
  }

  /** Runs the conversion and refreshes the grid. */
  convertResult(input: UnixTimestampInputModel): void {
    const result = this.converterService.convert(input);
    if (!result) {
      this.result = undefined;
      this.gridSource = [];
      return;
    }
    this.result = result;
    this.updateGridSource(result);
  }

  onClickCopy(): void {
    if (!this.result) {
      return;
    }

    const text = this.gridSource
      .map((row) => `${row.name}: ${row.value}`)
      .join('\n');

    if (!navigator.clipboard) {
      console.error('Clipboard API not available');
      this.snackBar.open(
        $localize`:@@common.copyError:コピーに失敗しました。`,
        $localize`:@@common.ok:はい`,
        { duration: 2000, horizontalPosition: 'start' },
      );
      return;
    }

    try {
      navigator.clipboard.writeText(text);
      this.snackBar.open(
        $localize`:@@common.copiedMessage:コピーしました。`,
        $localize`:@@common.ok:はい`,
        { duration: 2000, horizontalPosition: 'start' },
      );
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      this.snackBar.open(
        $localize`:@@common.copyError:コピーに失敗しました。`,
        $localize`:@@common.ok:はい`,
        { duration: 2000, horizontalPosition: 'start' },
      );
    }
  }

  private updateGridSource(result: UnixTimestampResult): void {
    this.gridSource = [
      {
        name: $localize`:@@page.unixTimestamp.card.output.localDateTime:日時 (ローカル)`,
        value: result.localDateTime,
      },
      {
        name: $localize`:@@page.unixTimestamp.card.output.iso8601:ISO 8601`,
        value: result.iso8601,
      },
      {
        name: $localize`:@@page.unixTimestamp.card.output.unixSeconds:UNIXタイムスタンプ (秒)`,
        value: result.unixSeconds,
      },
      {
        name: $localize`:@@page.unixTimestamp.card.output.unixMilliseconds:UNIXタイムスタンプ (ミリ秒)`,
        value: result.unixMilliseconds,
      },
      {
        name: $localize`:@@page.unixTimestamp.card.output.utcDateTime:日時 (UTC)`,
        value: result.utcDateTime,
      },
      {
        name: $localize`:@@page.unixTimestamp.card.output.timezoneDateTime:日時 (指定タイムゾーン)`,
        value: result.timezoneDateTime,
      },
      {
        name: $localize`:@@page.unixTimestamp.card.output.rfc2822:RFC 2822`,
        value: result.rfc2822,
      },
      {
        name: $localize`:@@page.unixTimestamp.card.output.weekday:曜日`,
        value: result.weekday,
      },
    ];
  }

  private updateTheme(isDark: boolean): void {
    this.theme = isDark ? 'darkCompact' : 'compact';
  }
}
