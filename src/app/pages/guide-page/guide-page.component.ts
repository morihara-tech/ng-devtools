import { Component } from '@angular/core';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { HyperLinkTextComponent } from '../../components/hyper-link-text/hyper-link-text.component';

@Component({
  selector: 'app-guide-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    HyperLinkTextComponent,
  ],
  templateUrl: './guide-page.component.html',
  styleUrl: './guide-page.component.scss',
})
export class GuidePageComponent {}
