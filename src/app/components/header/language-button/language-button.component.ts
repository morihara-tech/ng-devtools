import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Text } from '../../../../resources/texts/text';
import { LocaleService } from '../../locale/locale.service';
import { Locale } from '../../locale/locale-model';

@Component({
  selector: 'app-language-button',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './language-button.component.html',
  styleUrl: './language-button.component.scss'
})
export class LanguageButtonComponent {
  @Input() text?: Text;
  
  localeService: LocaleService = inject(LocaleService);

  onClickLanguage(locale: Locale): void {
    this.localeService.save(locale);
    location.reload();
  }

}
