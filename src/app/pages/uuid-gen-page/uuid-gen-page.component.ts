import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { UuidGenInputCardComponent } from './uuid-gen-input-card/uuid-gen-input-card.component';
import { UuidGenOutputCardComponent } from './uuid-gen-output-card/uuid-gen-output-card.component';
import { TEXT, Text } from '../../../resources/texts/text';
import { LocaleService } from '../../components/locale/locale.service';
import { mergeMap } from 'rxjs';
import { UuidGenInputModel } from './uuid-gen-model';

@Component({
  selector: 'app-uuid-gen-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    UuidGenInputCardComponent,
    UuidGenOutputCardComponent,
  ],
  templateUrl: './uuid-gen-page.component.html',
  styleUrl: './uuid-gen-page.component.scss'
})
export class UuidGenPageComponent implements OnInit {
  @ViewChild('output') output?: UuidGenOutputCardComponent;
  text?: Text;

  private readonly localeService = inject(LocaleService);

  ngOnInit(): void {
    this.localeService.get()
      .pipe(mergeMap((locale) => TEXT(locale)))
      .subscribe((res) => {
        this.text = res;
      });
  }

  onGenerate(input: UuidGenInputModel): void {
    if (!this.output) {
      return;
    }
    this.output.generateUuid(input);
  }

}
