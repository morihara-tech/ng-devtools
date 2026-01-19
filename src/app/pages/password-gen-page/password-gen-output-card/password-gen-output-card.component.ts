import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { TextViewerTableComponent } from '../../../components/text-viewer-table/text-viewer-table.component';
import { PasswordGenInputModel, PasswordCharacterType } from '../password-gen-model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-password-gen-output-card',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatTooltipModule,
        HeadingComponent,
        TextViewerTableComponent,
    ],
    templateUrl: './password-gen-output-card.component.html',
    styleUrl: './password-gen-output-card.component.scss'
})
export class PasswordGenOutputCardComponent {
  passwordStrings?: string;

  private snackBar = inject(MatSnackBar);

  generatePassword(input: PasswordGenInputModel): void {
    const passwords = this.makePasswords(input);
    this.passwordStrings = passwords.join('\n');
  }

  onClickCopy(): void {
    if (!this.passwordStrings) {
      return;
    }
    navigator.clipboard.writeText(this.passwordStrings);
    this.snackBar.open($localize`:@@common.copiedMessage:コピーしました。`,
      $localize`:@@common.ok:はい`, { duration: 2000, horizontalPosition: 'start' });
  }

  private makePasswords(input: PasswordGenInputModel): string[] {
    const results: string[] = [];
    const charset = this.getCharacterSet(input.characterType, input.excludeSimilar);
    
    for (let i = 0; i < input.count; i++) {
      results.push(this.generateRandomPassword(input.length, charset));
    }
    return results;
  }

  private generateRandomPassword(length: number, charset: string): string {
    let password = '';
    const charsetLength = charset.length;
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
      const randomIndex = randomValues[i] % charsetLength;
      password += charset[randomIndex];
    }
    
    return password;
  }

  private getCharacterSet(type: PasswordCharacterType, excludeSimilar: boolean): string {
    let charset = '';
    
    switch (type) {
      case 'alphanumeric-symbols':
        charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        break;
      case 'alphanumeric':
        charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        break;
      case 'lowercase-digits':
        charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
        break;
      case 'digits':
        charset = '0123456789';
        break;
    }
    
    if (excludeSimilar) {
      charset = charset.replace(/[1lI0O]/g, '');
    }
    
    return charset;
  }
}
