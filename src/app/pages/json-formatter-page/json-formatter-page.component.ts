import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { JsonFormatterInputCardComponent } from './json-formatter-input-card/json-formatter-input-card.component';
import { JsonFormatterHelpComponent } from './json-formatter-help/json-formatter-help.component';
import { StructuredDataService } from '../../core/services/structured-data.service';

@Component({
  selector: 'app-json-formatter-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    JsonFormatterInputCardComponent,
    JsonFormatterHelpComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './json-formatter-page.component.html',
  styleUrl: './json-formatter-page.component.scss'
})
export class JsonFormatterPageComponent implements OnInit, OnDestroy {
  private readonly structuredDataService = inject(StructuredDataService);

  ngOnInit(): void {
    this.structuredDataService.addSoftwareApplication({
      name: $localize`:@@page.jsonFormatter.title:JSON整形・バリデーションツール（インデント調整・ミニファイ対応）`,
      description: $localize`:@@page.jsonFormatter.description:崩れたJSONやAPIレスポンスを見やすく整形・検証できる無料ツールです。インデント調整やミニファイ、エスケープ処理にも対応し、レビューやデバッグ時の可読性向上にブラウザだけで使えます。`,
      routerLink: '/json-formatter',
    });
  }

  ngOnDestroy(): void {
    this.structuredDataService.remove();
  }
}
