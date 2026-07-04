import { Component, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IpCidrInputCardComponent } from './ip-cidr-input-card/ip-cidr-input-card.component';
import { IpCidrOutputCardComponent } from './ip-cidr-output-card/ip-cidr-output-card.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { IpCidrInputModel } from './ip-cidr-model';
import { IpCidrHelpComponent } from './ip-cidr-help/ip-cidr-help.component';
import { StructuredDataService } from '../../core/services/structured-data.service';

@Component({
  selector: 'app-ip-cidr-calculator-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    IpCidrInputCardComponent,
    IpCidrOutputCardComponent,
    IpCidrHelpComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './ip-cidr-calculator-page.component.html',
  styleUrl: './ip-cidr-calculator-page.component.scss'
})
export class IpCidrCalculatorPageComponent implements OnInit, OnDestroy {
  private readonly output = viewChild<IpCidrOutputCardComponent>('output');
  private readonly structuredDataService = inject(StructuredDataService);

  ngOnInit(): void {
    this.structuredDataService.addSoftwareApplication({
      name: $localize`:@@page.ipCidrCalculator.title:IP/CIDR計算ツール（サブネットマスク・ネットワークアドレス算出）`,
      description: $localize`:@@page.ipCidr.description:IPアドレスとCIDR表記からネットワークアドレス・ブロードキャストアドレス・利用可能ホスト数などを自動計算できる無料ツールです。サブネット設計やネットワーク構成確認に役立ちます。`,
      routerLink: '/ip-cidr-calculator',
    });
  }

  ngOnDestroy(): void {
    this.structuredDataService.remove();
  }

  onCalculate(input: IpCidrInputModel): void {
    this.output()?.calculateResult(input);
  }
}
