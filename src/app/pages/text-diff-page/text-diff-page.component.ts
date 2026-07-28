import { AfterViewInit, Component, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { TextDiffInputCardComponent } from './text-diff-input-card/text-diff-input-card.component';
import { TextDiffOutputCardComponent } from './text-diff-output-card/text-diff-output-card.component';
import { TextDiffInputModel } from './text-diff-model';
import { TextDiffHelpComponent } from './text-diff-help/text-diff-help.component';
import { StructuredDataService } from '../../core/services/structured-data.service';

@Component({
  selector: 'app-text-diff-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    TextDiffInputCardComponent,
    TextDiffOutputCardComponent,
    TextDiffHelpComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './text-diff-page.component.html',
  styleUrl: './text-diff-page.component.scss',
})
export class TextDiffPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly output = viewChild<TextDiffOutputCardComponent>('output');
  private readonly structuredDataService = inject(StructuredDataService);

  ngOnInit(): void {
    this.structuredDataService.addSoftwareApplication({
      name: $localize`:@@page.textDiffTool.title:テキスト差分比較ツール（2つの文章・コードの違いを可視化）`,
      description: $localize`:@@page.textDiff.description:2つのテキストやコードを貼り付けるだけで、追加・削除・変更箇所を色分けして可視化できる無料ツールです。設定ファイルの変更確認やレビュー前の差分チェックに使えます。`,
      routerLink: '/text-diff',
    });
  }

  ngOnDestroy(): void {
    this.structuredDataService.remove();
  }

  ngAfterViewInit(): void {
    this.structuredDataService.addFaqPageFromDom();
  }

  onCompare(input: TextDiffInputModel): void {
    this.output()?.diff(input);
  }

  onClear(): void {
    this.output()?.clear();
  }
}
