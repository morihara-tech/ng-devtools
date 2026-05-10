import { Component, inject, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { HelpDrawerService } from '../../services/help-drawer.service';
import { JsonFormatterInputCardComponent } from './json-formatter-input-card/json-formatter-input-card.component';

@Component({
  selector: 'app-json-formatter-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    JsonFormatterInputCardComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './json-formatter-page.component.html',
  styleUrl: './json-formatter-page.component.scss'
})
export class JsonFormatterPageComponent {
  private readonly helpDrawerService = inject(HelpDrawerService);

  onOpenHelp(content: TemplateRef<unknown>): void {
    this.helpDrawerService.open(content);
  }
}
