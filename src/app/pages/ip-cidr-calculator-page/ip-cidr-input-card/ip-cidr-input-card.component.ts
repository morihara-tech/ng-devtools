import { Component, EventEmitter, OnInit, AfterViewInit, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { IpCidrInputModel, IpProtocol } from '../ip-cidr-model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-ip-cidr-input-card',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    HeadingComponent,
  ],
  templateUrl: './ip-cidr-input-card.component.html',
  styleUrl: './ip-cidr-input-card.component.scss'
})
export class IpCidrInputCardComponent implements OnInit {
  @Output() calculate: EventEmitter<IpCidrInputModel> = new EventEmitter();

  formGroup?: FormGroup;
  protocol: IpProtocol = 'ipv4';

  // IPv4 pattern: xxx.xxx.xxx.xxx or xxx.xxx.xxx.xxx/cidr where xxx is 0-255
  private readonly IPV4_PATTERN = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/\d*)?$/;

  // IPv6 pattern: supports full, compressed, and mixed notations, with optional CIDR notation
  private readonly IPV6_PATTERN = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1}(:[0-9a-fA-F]{1,4}){1,6}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4})(?:\/\d*)?$/;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.resetForm();
    setTimeout(() => {
      this.onSubmit();
    }, 10);
  }

  onProtocolChange(protocol: IpProtocol): void {
    if (!this.formGroup) {
      return;
    }
    this.protocol = protocol;
    const cidrControl = this.formGroup.controls['cidr'];
    const ipControl = this.formGroup.controls['ipAddress'];

    if (protocol === 'ipv4') {
      cidrControl.setValue(24);
      cidrControl.setValidators([Validators.required, Validators.min(0), Validators.max(32)]);
      ipControl.setValidators([Validators.required, Validators.pattern(this.IPV4_PATTERN)]);
      ipControl.setValue('192.168.1.1');
    } else {
      cidrControl.setValue(64);
      cidrControl.setValidators([Validators.required, Validators.min(0), Validators.max(128)]);
      ipControl.setValidators([Validators.required, Validators.pattern(this.IPV6_PATTERN)]);
      ipControl.setValue('2001:db8::1');
    }

    cidrControl.updateValueAndValidity();
    ipControl.updateValueAndValidity();
  }

  onIpAddressBlur(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    const ipControl = this.formGroup?.controls['ipAddress'];
    const cidrControl = this.formGroup?.controls['cidr'];

    if (!ipControl || !cidrControl) {
      return;
    }

    const match = input.match(/^(.+?)(?:\/(\d+))?$/);
    if (match) {
      const ipPart = match[1];
      const cidrPart = match[2];

      if (cidrPart) {
        const cidrValue = parseInt(cidrPart, 10);
        const maxCidr = this.protocol === 'ipv4' ? 32 : 128;
        if (!isNaN(cidrValue) && cidrValue >= 0 && cidrValue <= maxCidr) {
          cidrControl.setValue(cidrValue, { emitEvent: false });
          cidrControl.updateValueAndValidity();
        }
      }
    }
  }

  onCidrChange(event: any): void {
    const ipControl = this.formGroup?.controls['ipAddress'];
    const cidrControl = this.formGroup?.controls['cidr'];

    if (!ipControl || !cidrControl) {
      return;
    }

    let currentIp = ipControl.value;
    const newCidr = cidrControl.value;
    if (currentIp.includes('/')) {
      currentIp = currentIp.split('/')[0];
    }
    const ipWithCidr = `${currentIp}/${newCidr}`;
    ipControl.setValue(ipWithCidr, { emitEvent: false });
  }

  onSubmit(): void {
    if (!this.formGroup || this.hasError) {
      return;
    }

    let ipAddress = this.formGroup.controls['ipAddress'].value;
    if (ipAddress.includes('/')) {
      ipAddress = ipAddress.split('/')[0];
    }

    const model: IpCidrInputModel = {
      protocol: this.protocol,
      ipAddress: ipAddress,
      cidr: Number(this.formGroup.controls['cidr'].value),
    };
    this.calculate.emit(model);
  }

  get hasError(): boolean {
    if (!this.formGroup) {
      return true;
    }
    return this.formGroup.status !== 'VALID';
  }

  get errorMessage(): string | null {
    if (!this.formGroup) {
      return null;
    }

    for (const key of Object.keys(this.formGroup.controls)) {
      if (this.formGroup.controls[key].errors?.['required']) {
        return $localize`:@@page.ipCidr.card.input.error.required:必須項目を入力してください。`;
      }
    }

    const ipControl = this.formGroup.controls['ipAddress'];
    if (ipControl.errors?.['pattern']) {
      if (this.protocol === 'ipv4') {
        return $localize`:@@page.ipCidr.card.input.error.invalidIpv4:有効なIPv4アドレスを入力してください。`;
      } else {
        return $localize`:@@page.ipCidr.card.input.error.invalidIpv6:有効なIPv6アドレスを入力してください。`;
      }
    }

    const cidrControl = this.formGroup.controls['cidr'];
    if (cidrControl.errors?.['min'] || cidrControl.errors?.['max']) {
      const maxCidr = this.protocol === 'ipv4' ? 32 : 128;
      return $localize`:@@page.ipCidr.card.input.error.cidrRange:CIDRは0以上${maxCidr}以下で入力してください。`;
    }

    return null;
  }

  get maxCidr(): number {
    return this.protocol === 'ipv4' ? 32 : 128;
  }

  get cidrValue(): number {
    return this.formGroup?.controls['cidr'].value || 0;
  }

  private resetForm(): void {
    this.formGroup = this.fb.group({
      ipAddress: this.fb.control<string>('192.168.1.1', [
        Validators.required,
        Validators.pattern(this.IPV4_PATTERN)
      ]),
      cidr: this.fb.control<number>(24, [
        Validators.required,
        Validators.min(0),
        Validators.max(32)
      ]),
    });
  }
}
