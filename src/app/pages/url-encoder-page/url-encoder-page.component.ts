import { Component, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { UrlEncoderInputCardComponent } from './url-encoder-input-card/url-encoder-input-card.component';
import { UrlEncoderOutputCardComponent } from './url-encoder-output-card/url-encoder-output-card.component';
import { UrlEncoderInputModel } from './url-encoder-model';
import { UrlEncoderHelpComponent } from './url-encoder-help/url-encoder-help.component';
import { StructuredDataService } from '../../core/services/structured-data.service';

@Component({
  selector: 'app-url-encoder-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    UrlEncoderInputCardComponent,
    UrlEncoderOutputCardComponent,
    UrlEncoderHelpComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './url-encoder-page.component.html',
  styleUrl: './url-encoder-page.component.scss',
})
export class UrlEncoderPageComponent implements OnInit, OnDestroy {
  private readonly output = viewChild<UrlEncoderOutputCardComponent>('output');
  private readonly structuredDataService = inject(StructuredDataService);

  ngOnInit(): void {
    this.structuredDataService.addSoftwareApplication({
      name: $localize`:@@page.urlEncoderTool.title:URLエンコード・デコードツール（パーセントエンコーディング対応）`,
      description: $localize`:@@page.urlEncoder.description:URLやクエリ文字列に含まれる日本語・記号をパーセントエンコード／デコードできる無料ツールです。特殊文字が原因のURLエラー調査やAPIパラメータ確認にも役立ちます。`,
      routerLink: '/url-encoder',
    });
  }

  ngOnDestroy(): void {
    this.structuredDataService.remove();
  }

  onConvert(input: UrlEncoderInputModel): void {
    this.output()?.convert(input);
  }

  onClear(): void {
    this.output()?.clear();
  }
}
