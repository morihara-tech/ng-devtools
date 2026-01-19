export interface PasswordGenInputModel {
  length: number;
  count: number;
  characterType: PasswordCharacterType;
  excludeSimilar: boolean;
}

export type PasswordCharacterType = 'alphanumeric-symbols' | 'alphanumeric' | 'lowercase-digits' | 'digits';
