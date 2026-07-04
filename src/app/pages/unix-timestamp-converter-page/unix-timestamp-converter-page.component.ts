import { Component, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { UnixTimestampInputCardComponent } from './unix-timestamp-input-card/unix-timestamp-input-card.component';
import { UnixTimestampOutputCardComponent } from './unix-timestamp-output-card/unix-timestamp-output-card.component';
import { UnixTimestampInputModel } from './unix-timestamp-model';
import { UnixTimestampHelpComponent } from './unix-timestamp-help/unix-timestamp-help.component';
import { StructuredDataService } from '../../core/services/structured-data.service';

@Component({
  selector: 'app-unix-timestamp-converter-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    UnixTimestampInputCardComponent,
    UnixTimestampOutputCardComponent,
    UnixTimestampHelpComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './unix-timestamp-converter-page.component.html',
  styleUrl: './unix-timestamp-converter-page.component.scss',
})
export class UnixTimestampConverterPageComponent implements OnInit, OnDestroy {
  private readonly output = viewChild<UnixTimestampOutputCardComponent>('output');
  private readonly structuredDataService = inject(StructuredDataService);

  ngOnInit(): void {
    this.structuredDataService.addSoftwareApplication({
      name: $localize`:@@page.unixTimestampConverter.title:UNIXタイムスタンプ変換ツール（秒/ミリ秒⇔日時の相互変換）`,
      description: $localize`:@@page.unixTimestamp.description:UNIXタイムスタンプ（秒・ミリ秒）と日時表記を相互に変換できる無料ツールです。タイムゾーンを指定した変換にも対応し、ログ調査やAPIレスポンスの時刻確認にそのまま使えます。`,
      routerLink: '/unix-timestamp-converter',
    });
  }

  ngOnDestroy(): void {
    this.structuredDataService.remove();
  }

  onConvert(input: UnixTimestampInputModel): void {
    this.output()?.convertResult(input);
  }
}
