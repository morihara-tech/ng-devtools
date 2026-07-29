import { AfterViewInit, Component, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PasswordGenInputCardComponent } from './password-gen-input-card/password-gen-input-card.component';
import { PasswordGenOutputCardComponent } from './password-gen-output-card/password-gen-output-card.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { PasswordGenInputModel } from './password-gen-model';
import { PasswordGenHelpComponent } from './password-gen-help/password-gen-help.component';
import { StructuredDataService } from '../../core/services/structured-data.service';

@Component({
    selector: 'app-password-gen-page',
    imports: [
        ApplicationPageTemplateComponent,
        HeadingComponent,
        PasswordGenInputCardComponent,
        PasswordGenOutputCardComponent,
        PasswordGenHelpComponent,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './password-gen-page.component.html',
    styleUrl: './password-gen-page.component.scss'
})
export class PasswordGenPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly output = viewChild<PasswordGenOutputCardComponent>('output');
  private readonly structuredDataService = inject(StructuredDataService);

  ngOnInit(): void {
    this.structuredDataService.addSoftwareApplication({
      name: $localize`:@@page.passwordGenerator.title:安全なパスワード生成ツール（文字種・桁数を指定可能）`,
      description: $localize`:@@page.password.description:文字種や桁数を細かく指定して安全なランダムパスワードを生成できる無料ツールです。使い回しを避けたい会員登録やサーバー設定、テスト用アカウント作成時にすぐ使えます。`,
      routerLink: '/password-generator',
    });
  }

  ngOnDestroy(): void {
    this.structuredDataService.remove();
  }

  ngAfterViewInit(): void {
    this.structuredDataService.addFaqPageFromDom();
  }

  onGenerate(input: PasswordGenInputModel): void {
    this.output()?.generatePassword(input);
  }
}
