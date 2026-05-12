import { Component, inject, TemplateRef, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PasswordGenInputCardComponent } from './password-gen-input-card/password-gen-input-card.component';
import { PasswordGenOutputCardComponent } from './password-gen-output-card/password-gen-output-card.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HelpDrawerService } from '../../services/help-drawer.service';
import { PasswordGenInputModel } from './password-gen-model';
import { PasswordGenHelpComponent } from './password-gen-help/password-gen-help.component';

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
export class PasswordGenPageComponent {
  private readonly output = viewChild<PasswordGenOutputCardComponent>('output');
  private readonly helpDrawerService = inject(HelpDrawerService);

  onGenerate(input: PasswordGenInputModel): void {
    this.output()?.generatePassword(input);
  }

  onOpenHelp(content: TemplateRef<unknown>): void {
    this.helpDrawerService.open(content);
  }
}
