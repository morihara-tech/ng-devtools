import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
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

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.resetForm();
    setTimeout(() => {
      this.onCalculate();
    }, 10);
  }

  onProtocolChange(protocol: IpProtocol): void {
    if (!this.formGroup) {
      return;
    }
    this.protocol = protocol;
    
    // Update CIDR range based on protocol
    const cidrControl = this.formGroup.controls['cidr'];
    if (protocol === 'ipv4') {
      cidrControl.setValue(24);
      cidrControl.setValidators([Validators.required, Validators.min(0), Validators.max(32)]);
    } else {
      cidrControl.setValue(64);
      cidrControl.setValidators([Validators.required, Validators.min(0), Validators.max(128)]);
    }
    cidrControl.updateValueAndValidity();
    
    // Clear IP address to avoid confusion
    this.formGroup.controls['ipAddress'].setValue('');
  }

  onIpAddressInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    
    // Smart input: detect CIDR notation and auto-split
    const match = input.match(/^(.+)\/(\d+)$/);
    if (match && this.formGroup) {
      const ipPart = match[1];
      const cidrPart = parseInt(match[2], 10);
      
      // Set IP address without CIDR
      this.formGroup.controls['ipAddress'].setValue(ipPart);
      
      // Set CIDR if valid
      const maxCidr = this.protocol === 'ipv4' ? 32 : 128;
      if (cidrPart >= 0 && cidrPart <= maxCidr) {
        this.formGroup.controls['cidr'].setValue(cidrPart);
      }
    }
  }

  onCalculate(): void {
    if (!this.formGroup || this.hasError) {
      return;
    }
    const model: IpCidrInputModel = {
      protocol: this.protocol,
      ipAddress: this.formGroup.controls['ipAddress'].value,
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
    const ipv4Pattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    this.formGroup = this.fb.group({
      ipAddress: this.fb.control<string>('192.168.1.1', [
        Validators.required,
        Validators.pattern(ipv4Pattern)
      ]),
      cidr: this.fb.control<number>(24, [
        Validators.required,
        Validators.min(0),
        Validators.max(32)
      ]),
    });

    // Listen to form changes for real-time calculation
    this.formGroup.valueChanges.subscribe(() => {
      if (!this.hasError) {
        this.onCalculate();
      }
    });
  }
}
