import { Component, OnInit, output, viewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { SvgToPngSettingsModel, DEFAULT_SVG_TO_PNG_SETTINGS } from '../svg-to-png-model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SvgCodeEditorComponent } from '../svg-code-editor/svg-code-editor.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-svg-to-png-input-card',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    HeadingComponent,
    SvgCodeEditorComponent,
  ],
  templateUrl: './svg-to-png-input-card.component.html',
  styleUrl: './svg-to-png-input-card.component.scss'
})
export class SvgToPngInputCardComponent implements OnInit {
  private readonly svgCodeEditorComponent = viewChild(SvgCodeEditorComponent);
  readonly settingsChange = output<SvgToPngSettingsModel>();
  readonly svgCodeChange = output<string>();

  formGroup?: FormGroup;
  editorValue: string = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <circle cx="128" cy="128" r="80" fill="#AE1C1D" />
  <text x="128" y="138" text-anchor="middle" font-size="24" fill="white">SVG</text>
</svg>`;
  private snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.resetForm();
    this.formGroup?.valueChanges.subscribe(() => {
      this.handleTransparentToggle();
      this.emitSettings();
    });
  }

  onSvgCodeChange(svgCode: string): void {
    this.extractAndApplySvgDimensions(svgCode);
    this.svgCodeChange.emit(svgCode);
  }

  getSvgCode(): string {
    return this.editorValue ?? '';
  }

  get hasError(): boolean {
    if (!this.formGroup) {
      return true;
    }
    return this.formGroup.status !== 'VALID';
  }

  get scaleValue(): number {
    return this.formGroup?.controls['scale'].value ?? 100;
  }

  formatLabel(value: number): string {
    return `${value}%`;
  }

  onBackgroundColorChange(value: string): void {
    if (this.formGroup) {
      this.formGroup.controls['backgroundColor'].setValue(value, { emitEvent: false });
      this.emitSettings();
    }
  }

  onClickClear(): void {
    const previousValue = this.editorValue;
    this.editorValue = '';
    
    const snackBarRef = this.snackBar.open(
      $localize`:@@common.clearedMessage:クリアしました。`,
      $localize`:@@common.undo:元に戻す`,
      { duration: 5000, horizontalPosition: 'start' }
    );

    snackBarRef.onAction().subscribe(() => {
      this.editorValue = previousValue;
    });
  }

  private resetForm(): void {
    this.formGroup = this.fb.group({
      canvasWidth: this.fb.control<number>(DEFAULT_SVG_TO_PNG_SETTINGS.canvasWidth, [
        Validators.required,
        Validators.min(1),
        Validators.max(5000)
      ]),
      canvasHeight: this.fb.control<number>(DEFAULT_SVG_TO_PNG_SETTINGS.canvasHeight, [
        Validators.required,
        Validators.min(1),
        Validators.max(5000)
      ]),
      transparent: this.fb.control<boolean>(DEFAULT_SVG_TO_PNG_SETTINGS.transparent),
      backgroundColor: this.fb.control<string>(DEFAULT_SVG_TO_PNG_SETTINGS.backgroundColor),
      scale: this.fb.control<number>(DEFAULT_SVG_TO_PNG_SETTINGS.scale, [
        Validators.required,
        Validators.min(1),
        Validators.max(500)
      ]),
      offsetX: this.fb.control<number>(DEFAULT_SVG_TO_PNG_SETTINGS.offsetX, [
        Validators.required
      ]),
      offsetY: this.fb.control<number>(DEFAULT_SVG_TO_PNG_SETTINGS.offsetY, [
        Validators.required
      ]),
    });
  }

  private handleTransparentToggle(): void {
    if (!this.formGroup) {
      return;
    }
    const isTransparent = this.formGroup.controls['transparent'].value;
    const backgroundColorControl = this.formGroup.controls['backgroundColor'];
    
    if (isTransparent) {
      backgroundColorControl.disable({ emitEvent: false });
    } else {
      backgroundColorControl.enable({ emitEvent: false });
    }
  }

  /**
   * Extracts width, height, and viewBox from the SVG root element.
   * When both viewBox and width/height attributes are present, patches the form
   * with those values so the canvas matches the SVG's declared dimensions and origin.
   */
  private extractAndApplySvgDimensions(svgCode: string): void {
    if (!this.formGroup || !svgCode) {
      return;
    }

    const svgTagMatch = svgCode.match(/<svg([^>]*)>/i);
    if (!svgTagMatch) {
      return;
    }

    const svgTag = svgTagMatch[1];
    const widthMatch = svgTag.match(/width=["']([^"']+)["']/i);
    const heightMatch = svgTag.match(/height=["']([^"']+)["']/i);
    const viewBoxMatch = svgTag.match(/viewBox=["']([^"']+)["']/i);

    if (!widthMatch || !heightMatch || !viewBoxMatch) {
      return;
    }

    const width = parseFloat(widthMatch[1]);
    const height = parseFloat(heightMatch[1]);
    const viewBoxParts = viewBoxMatch[1].trim().split(/[\s,]+/);

    if (viewBoxParts.length !== 4) {
      return;
    }

    const minX = parseFloat(viewBoxParts[0]);
    const minY = parseFloat(viewBoxParts[1]);

    if (isNaN(width) || isNaN(height) || isNaN(minX) || isNaN(minY)) {
      return;
    }

    if (width <= 0 || height <= 0) {
      return;
    }

    this.formGroup.patchValue({
      canvasWidth: width,
      canvasHeight: height,
      offsetX: minX,
      offsetY: minY,
    });
  }

  private emitSettings(): void {
    if (!this.formGroup || this.hasError) {
      return;
    }
    const model: SvgToPngSettingsModel = {
      canvasWidth: Number(this.formGroup.controls['canvasWidth'].value),
      canvasHeight: Number(this.formGroup.controls['canvasHeight'].value),
      transparent: Boolean(this.formGroup.controls['transparent'].value),
      backgroundColor: this.formGroup.controls['backgroundColor'].value ?? '#ffffff',
      scale: Number(this.formGroup.controls['scale'].value),
      offsetX: Number(this.formGroup.controls['offsetX'].value),
      offsetY: Number(this.formGroup.controls['offsetY'].value),
    };
    this.settingsChange.emit(model);
  }
}
