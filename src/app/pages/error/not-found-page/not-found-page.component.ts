import { Component } from '@angular/core';
import { ErrorTemplateComponent } from '../../../components/error-template/error-template.component';

@Component({
    selector: 'app-not-found-page',
    imports: [
        ErrorTemplateComponent
    ],
    templateUrl: './not-found-page.component.html',
    styleUrl: './not-found-page.component.scss'
})
export class NotFoundPageComponent {

}
