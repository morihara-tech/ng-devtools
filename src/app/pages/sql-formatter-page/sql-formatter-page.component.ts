import { Component, inject, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { HelpDrawerService } from '../../services/help-drawer.service';
import { SqlFormatterInputCardComponent } from './sql-formatter-input-card/sql-formatter-input-card.component';
import { SqlFormatterHelpComponent } from './sql-formatter-help/sql-formatter-help.component';

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
export class SqlFormatterPageComponent {
  private readonly helpDrawerService = inject(HelpDrawerService);

  onOpenHelp(content: TemplateRef<unknown>): void {
    this.helpDrawerService.open(content);
  }
}
