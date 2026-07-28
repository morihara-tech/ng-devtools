import { AfterViewInit, Component, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UlidGenInputCardComponent } from './ulid-gen-input-card/ulid-gen-input-card.component';
import { UlidGenOutputCardComponent } from './ulid-gen-output-card/ulid-gen-output-card.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { UlidGenInputModel } from './ulid-gen-model';
import { UlidGenHelpComponent } from './ulid-gen-help/ulid-gen-help.component';
import { StructuredDataService } from '../../core/services/structured-data.service';

@Component({
    selector: 'app-ulid-gen-page',
    imports: [
        ApplicationPageTemplateComponent,
        HeadingComponent,
        UlidGenInputCardComponent,
        UlidGenOutputCardComponent,
        UlidGenHelpComponent,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './ulid-gen-page.component.html',
    styleUrl: './ulid-gen-page.component.scss'
})
export class UlidGenPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly output = viewChild<UlidGenOutputCardComponent>('output');
  private readonly structuredDataService = inject(StructuredDataService);

  ngOnInit(): void {
    this.structuredDataService.addSoftwareApplication({
      name: $localize`:@@page.ulidGenerator.title:ULID生成ツール（時系列ソート可能な一意ID・一括生成）`,
      description: $localize`:@@page.ulid.description:タイムスタンプを含み時系列で並び替え可能なULIDを指定した個数だけ一括生成できる無料ツールです。DBの主キーやログの識別子など、生成順に並べたいIDが必要な場面で使えます。`,
      routerLink: '/ulid-generator',
    });
  }

  ngOnDestroy(): void {
    this.structuredDataService.remove();
  }

  ngAfterViewInit(): void {
    this.structuredDataService.addFaqPageFromDom();
  }

  onGenerate(input: UlidGenInputModel): void {
    this.output()?.generateUlid(input);
  }
}
