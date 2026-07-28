import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { SqlFormatterInputCardComponent } from './sql-formatter-input-card/sql-formatter-input-card.component';
import { SqlFormatterHelpComponent } from './sql-formatter-help/sql-formatter-help.component';
import { StructuredDataService } from '../../core/services/structured-data.service';

@Component({
  selector: 'app-sql-formatter-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    SqlFormatterInputCardComponent,
    SqlFormatterHelpComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './sql-formatter-page.component.html',
  styleUrl: './sql-formatter-page.component.scss'
})
export class SqlFormatterPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly structuredDataService = inject(StructuredDataService);

  ngOnInit(): void {
    this.structuredDataService.addSoftwareApplication({
      name: $localize`:@@page.sqlFormatter.title:SQL整形ツール（ORM生成SQL・複雑なJOIN句にも対応）`,
      description: $localize`:@@page.sql.description:ORMが自動生成した読みにくいSQLや複雑なJOIN句を含むクエリも、インデントを自動調整して見やすく整形できる無料ツールです。レビュー前の整形やドキュメント共有時の可読性向上に便利です。`,
      routerLink: '/sql-formatter',
    });
  }

  ngOnDestroy(): void {
    this.structuredDataService.remove();
  }

  ngAfterViewInit(): void {
    this.structuredDataService.addFaqPageFromDom();
  }
}
