import { Component } from '@angular/core';
import { ApplicationPageTemplateComponent } from '../../components/application-page-template/application-page-template.component';
import { HeadingComponent } from '../../components/heading/heading.component';
import { SqlFormatterHelpComponent } from '../sql-formatter-page/sql-formatter-help/sql-formatter-help.component';
import { JsonFormatterHelpComponent } from '../json-formatter-page/json-formatter-help/json-formatter-help.component';
import { ApiKeyGenHelpComponent } from '../api-key-gen-page/api-key-gen-help/api-key-gen-help.component';
import { PasswordGenHelpComponent } from '../password-gen-page/password-gen-help/password-gen-help.component';
import { ColorPaletteHelpComponent } from '../color-palette-page/color-palette-help/color-palette-help.component';
import { UuidGenHelpComponent } from '../uuid-gen-page/uuid-gen-help/uuid-gen-help.component';
import { UlidGenHelpComponent } from '../ulid-gen-page/ulid-gen-help/ulid-gen-help.component';
import { UnixTimestampHelpComponent } from '../unix-timestamp-converter-page/unix-timestamp-help/unix-timestamp-help.component';
import { UrlEncoderHelpComponent } from '../url-encoder-page/url-encoder-help/url-encoder-help.component';
import { TextDiffHelpComponent } from '../text-diff-page/text-diff-help/text-diff-help.component';
import { SvgViewerHelpComponent } from '../svg-to-png-page/svg-viewer-help/svg-viewer-help.component';
import { IpCidrHelpComponent } from '../ip-cidr-calculator-page/ip-cidr-help/ip-cidr-help.component';

@Component({
  selector: 'app-guide-page',
  imports: [
    ApplicationPageTemplateComponent,
    HeadingComponent,
    SqlFormatterHelpComponent,
    JsonFormatterHelpComponent,
    ApiKeyGenHelpComponent,
    PasswordGenHelpComponent,
    ColorPaletteHelpComponent,
    UuidGenHelpComponent,
    UlidGenHelpComponent,
    UnixTimestampHelpComponent,
    UrlEncoderHelpComponent,
    TextDiffHelpComponent,
    SvgViewerHelpComponent,
    IpCidrHelpComponent,
  ],
  templateUrl: './guide-page.component.html',
  styleUrl: './guide-page.component.scss',
})
export class GuidePageComponent {}
