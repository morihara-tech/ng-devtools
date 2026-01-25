import { Component, inject } from '@angular/core';
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
export class IpCidrOutputCardComponent {
  result?: IpCidrResult;
  gridSource: GridRow[] = [];
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
      autoSize: true
    },
  ];

  private snackBar = inject(MatSnackBar);
  private calculatorService = inject(IpCidrCalculatorService);

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

  get networkPart(): string {
    if (!this.result?.binaryRepresentation || !this.result.networkBits) {
      return '';
    }
    
    const binary = this.result.binaryRepresentation;
    const networkBits = this.result.networkBits;
    
    if (binary.includes('.')) {
      // IPv4 binary format: "11000000.10101000.00000001.00000001"
      const bitsOnly = binary.replace(/\./g, '');
      const networkPart = bitsOnly.substring(0, networkBits);
      
      // Re-add dots every 8 bits
      let result = '';
      for (let i = 0; i < networkPart.length; i++) {
        if (i > 0 && i % 8 === 0) {
          result += '.';
        }
        result += networkPart[i];
      }
      return result;
    } else {
      // IPv6 hex format: "2001:0db8:0000:0000:0000:0000:0000:0001"
      const hexOnly = binary.replace(/:/g, '');
      const bitsNeeded = Math.ceil(networkBits / 4);
      const networkHex = hexOnly.substring(0, bitsNeeded);
      
      // Re-add colons every 4 characters
      let result = '';
      for (let i = 0; i < networkHex.length; i++) {
        if (i > 0 && i % 4 === 0) {
          result += ':';
        }
        result += networkHex[i];
      }
      return result;
    }
  }

  get hostPart(): string {
    if (!this.result?.binaryRepresentation || !this.result.networkBits) {
      return '';
    }
    
    const binary = this.result.binaryRepresentation;
    const networkBits = this.result.networkBits;
    
    if (binary.includes('.')) {
      // IPv4
      const bitsOnly = binary.replace(/\./g, '');
      const hostPart = bitsOnly.substring(networkBits);
      
      // Re-add dots
      let result = '';
      let bitCount = networkBits;
      for (let i = 0; i < hostPart.length; i++) {
        if (bitCount > 0 && bitCount % 8 === 0 && i > 0) {
          result += '.';
        }
        result += hostPart[i];
        bitCount++;
      }
      return result;
    } else {
      // IPv6
      const hexOnly = binary.replace(/:/g, '');
      const bitsNeeded = Math.ceil(networkBits / 4);
      const hostHex = hexOnly.substring(bitsNeeded);
      
      // Re-add colons
      let result = '';
      let charCount = bitsNeeded;
      for (let i = 0; i < hostHex.length; i++) {
        if (charCount > 0 && charCount % 4 === 0 && i > 0) {
          result += ':';
        }
        result += hostHex[i];
        charCount++;
      }
      return result;
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
}
