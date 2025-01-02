import { Component, OnInit } from '@angular/core';
import { UlidGenInputCardComponent } from './ulid-gen-input-card/ulid-gen-input-card.component';
import { UlidGenOutputCardComponent } from './ulid-gen-output-card/ulid-gen-output-card.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { TEXT, Text } from '../../../resources/texts/text';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';

@Component({
  selector: 'app-ulid-gen-page',
  standalone: true,
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    UlidGenInputCardComponent,
    UlidGenOutputCardComponent,
  ],
  templateUrl: './ulid-gen-page.component.html',
  styleUrl: './ulid-gen-page.component.scss'
})
export class UlidGenPageComponent implements OnInit {
  text?: Text;

  ngOnInit(): void {
    // TODO locale
    TEXT('ja').subscribe(res => {
      this.text = res;
    });
  }


}
