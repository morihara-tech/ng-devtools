import { Component, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { UuidGenInputCardComponent } from './uuid-gen-input-card/uuid-gen-input-card.component';
import { UuidGenOutputCardComponent } from './uuid-gen-output-card/uuid-gen-output-card.component';
import { UuidGenInputModel } from './uuid-gen-model';
import { UuidGenHelpComponent } from './uuid-gen-help/uuid-gen-help.component';
import { StructuredDataService } from '../../core/services/structured-data.service';

@Component({
  selector: 'app-uuid-gen-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    UuidGenInputCardComponent,
    UuidGenOutputCardComponent,
    UuidGenHelpComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './uuid-gen-page.component.html',
  styleUrl: './uuid-gen-page.component.scss'
})
export class UuidGenPageComponent implements OnInit, OnDestroy {
  private readonly output = viewChild<UuidGenOutputCardComponent>('output');
  private readonly structuredDataService = inject(StructuredDataService);

  ngOnInit(): void {
    this.structuredDataService.addSoftwareApplication({
      name: $localize`:@@page.uuidGenerator.title:UUID生成ツール（v1/v4/v7対応・一括生成）`,
      description: $localize`:@@page.uuid.description:UUID v1・v4・v7を用途に応じて指定した個数だけ一括生成できる無料ツールです。テストデータ作成やDB設計、APIのダミーID生成など開発現場でそのまま使えます。`,
      routerLink: '/uuid-generator',
    });
  }

  ngOnDestroy(): void {
    this.structuredDataService.remove();
  }

  onGenerate(input: UuidGenInputModel): void {
    this.output()?.generateUuid(input);
  }
}
