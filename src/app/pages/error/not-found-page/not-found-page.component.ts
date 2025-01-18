import { Component, OnInit, inject } from '@angular/core';
import { TEXT, Text } from '../../../../resources/texts/text';
import { ErrorTemplateComponent } from '../../../components/error-template/error-template.component';
import { LocaleService } from '../../../components/locale/locale.service';
import { mergeMap } from 'rxjs';

@Component({
    selector: 'app-not-found-page',
    imports: [
        ErrorTemplateComponent
    ],
    templateUrl: './not-found-page.component.html',
    styleUrl: './not-found-page.component.scss'
})
export class NotFoundPageComponent implements OnInit {
  text?: Text;

  private readonly localeService: LocaleService = inject(LocaleService);

  ngOnInit(): void {
    this.localeService.get()
      .pipe(mergeMap((locale) => TEXT(locale)))
      .subscribe((res) => {
        this.text = res;
      });
  }

}
