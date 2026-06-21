import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { HyperLinkTextComponent } from '../../components/hyper-link-text/hyper-link-text.component';

/** Displays the privacy policy content for the application. */
@Component({
  selector: 'app-privacy-policy-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    HyperLinkTextComponent,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './privacy-policy-page.component.html',
  styleUrl: './privacy-policy-page.component.scss',
})
export class PrivacyPolicyPageComponent {}
