import { AfterViewInit, Component, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { ApiKeyGenInputCardComponent } from './api-key-gen-input-card/api-key-gen-input-card.component';
import { ApiKeyGenOutputCardComponent } from './api-key-gen-output-card/api-key-gen-output-card.component';
import { ApiKeyGenInputModel } from './api-key-gen-model';
import { ApiKeyGenHelpComponent } from './api-key-gen-help/api-key-gen-help.component';
import { StructuredDataService } from '../../core/services/structured-data.service';

@Component({
  selector: 'app-api-key-gen-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    ApiKeyGenInputCardComponent,
    ApiKeyGenOutputCardComponent,
    ApiKeyGenHelpComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './api-key-gen-page.component.html',
  styleUrl: './api-key-gen-page.component.scss'
})
export class ApiKeyGenPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly output = viewChild<ApiKeyGenOutputCardComponent>('output');
  private readonly structuredDataService = inject(StructuredDataService);

  ngOnInit(): void {
    this.structuredDataService.addSoftwareApplication({
      name: $localize`:@@page.apiKeyGenerator.title:APIキー生成ツール（ランダムなAPIキー・シークレットを生成）`,
      description: $localize`:@@page.apiKey.description:開発環境やMCPサーバー向けのランダムなAPIキー・シークレットトークンを無料で生成できるツールです。文字数や文字種を指定でき、ローカル環境変数やテスト用の仮キー作成にすぐ使えます。`,
      routerLink: '/api-key-generator',
    });
  }

  ngOnDestroy(): void {
    this.structuredDataService.remove();
  }

  ngAfterViewInit(): void {
    this.structuredDataService.addFaqPageFromDom();
  }

  onGenerate(input: ApiKeyGenInputModel): void {
    this.output()?.generateApiKeys(input);
  }
}
