import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { IpCidrInputModel, IpCidrResult } from '../ip-cidr-model';
import { IpCidrCalculatorService } from '../ip-cidr-calculator.service';
import { RevoGrid } from '@revolist/angular-datagrid';
import { ColumnRegular } from '@revolist/revogrid';

interface GridRow {
  name: string;
  value: string;
}

@Component({
  selector: 'app-ip-cidr-output-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    HeadingComponent,
    RevoGrid,
  ],
  templateUrl: './ip-cidr-output-card.component.html',
  styleUrl: './ip-cidr-output-card.component.scss'
})
export class IpCidrOutputCardComponent implements OnInit, OnDestroy {
  result?: IpCidrResult;
  gridSource: GridRow[] = [];
  theme: 'compact' | 'darkCompact' = 'compact';
  
  private mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  private themeListener = (e: MediaQueryListEvent) => this.updateTheme(e.matches);

  columns: ColumnRegular[] = [
    { 
      prop: 'name', 
      name: $localize`:@@page.ipCidr.card.output.grid.columnName:項目`,
      readonly: true,
      size: 200
    },
    { 
      prop: 'value', 
      name: $localize`:@@page.ipCidr.card.output.grid.columnValue:値`,
      readonly: true,
      size: 240
    },
  ];

  private snackBar = inject(MatSnackBar);
  private calculatorService = inject(IpCidrCalculatorService);

  ngOnInit(): void {
    const isDark = this.mediaQueryList.matches;
    this.updateTheme(isDark);
    this.mediaQueryList.addEventListener('change', this.themeListener);
  }

  ngOnDestroy(): void {
    this.mediaQueryList.removeEventListener('change', this.themeListener);
  }

  calculateResult(input: IpCidrInputModel): void {
    const result = this.calculatorService.calculate(input.protocol, input.ipAddress, input.cidr);
    if (!result) {
      this.result = undefined;
      this.gridSource = [];
      return;
    }

    this.result = result;
    this.updateGridSource(result);
  }

  onClickCopyJson(): void {
    if (!this.result) {
      return;
    }
    
    const json = JSON.stringify(this.result, null, 2);
    
    // Check if clipboard API is available
    if (!navigator.clipboard) {
      console.error('Clipboard API not available');
      this.snackBar.open($localize`:@@common.copyError:コピーに失敗しました。`,
        $localize`:@@common.ok:はい`, { duration: 2000, horizontalPosition: 'start' });
      return;
    }
    
    try {
      navigator.clipboard.writeText(json);
      this.snackBar.open($localize`:@@common.copiedMessage:コピーしました。`,
        $localize`:@@common.ok:はい`, { duration: 2000, horizontalPosition: 'start' });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      this.snackBar.open($localize`:@@common.copyError:コピーに失敗しました。`,
        $localize`:@@common.ok:はい`, { duration: 2000, horizontalPosition: 'start' });
    }
  }

  private updateGridSource(result: IpCidrResult): void {
    this.gridSource = [
      { 
        name: $localize`:@@page.ipCidr.card.output.cidrNotation:CIDR表記`, 
        value: result.cidrNotation 
      },
      { 
        name: $localize`:@@page.ipCidr.card.output.netmask:ネットマスク`, 
        value: result.netmask 
      },
      { 
        name: $localize`:@@page.ipCidr.card.output.networkAddress:ネットワークアドレス`, 
        value: result.networkAddress 
      },
      { 
        name: $localize`:@@page.ipCidr.card.output.firstHost:最初のホスト`, 
        value: result.firstHost 
      },
      { 
        name: $localize`:@@page.ipCidr.card.output.lastHost:最後のホスト`, 
        value: result.lastHost 
      },
      { 
        name: $localize`:@@page.ipCidr.card.output.totalHosts:合計ホスト数`, 
        value: result.totalHosts 
      },
      { 
        name: $localize`:@@page.ipCidr.card.output.ipType:IPタイプ`, 
        value: result.ipType 
      },
    ];
  }

  private updateTheme(isDark: boolean): void {
    this.theme = isDark ? 'darkCompact' : 'compact';
  }
}
