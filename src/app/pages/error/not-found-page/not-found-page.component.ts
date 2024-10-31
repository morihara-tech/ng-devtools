import { Component, OnInit } from '@angular/core';
import { TEXT, Text } from '../../../../resources/texts/text';
import { ErrorTemplateComponent } from '../../../components/error-template/error-template.component';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [
    ErrorTemplateComponent
  ],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss'
})
export class NotFoundPageComponent implements OnInit {
  text?: Text;

  ngOnInit(): void {
    // TODO locale
    TEXT('ja').subscribe(res => {
      this.text = res;
    });
  }

}
