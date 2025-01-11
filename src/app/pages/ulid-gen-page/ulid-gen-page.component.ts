import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { UlidGenInputCardComponent } from './ulid-gen-input-card/ulid-gen-input-card.component';
import { UlidGenOutputCardComponent } from './ulid-gen-output-card/ulid-gen-output-card.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { TEXT, Text } from '../../../resources/texts/text';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { UlidGenInputModel } from './ulid-gen-model';
import { mergeMap } from 'rxjs';
import { LocaleService } from '../../components/locale/locale.service';

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
  @ViewChild('output') output?: UlidGenOutputCardComponent;
  text?: Text;

  private readonly localeService: LocaleService = inject(LocaleService);

  ngOnInit(): void {
    this.localeService.get()
      .pipe(mergeMap((locale) => TEXT(locale)))
      .subscribe((res) => {
        this.text = res;
      });
  }

  onGenerate(input: UlidGenInputModel): void {
    if (!this.output) {
      return;
    }
    this.output.generateUlid(input);
  }

}
