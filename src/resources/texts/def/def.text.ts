import { Locale, Text } from "../text";

export const DEF_TEXT: { [locale in Locale]: Text } = {
  ja: {
    // common
    'guest': 'ゲスト',
    'goBackHome': 'ホームに戻る',
    'copyRight': '© 2024 Yutaka Morihara',
    'hours': '時',
    'minutes': '分',
    'seconds': '秒',
    'ok': 'はい',
    'cancel': 'キャンセル',
    // error
    'notFoundErrorTitle': 'ページが見つかりません',
    'notFoundErrorMessage': '申し訳ございません。\nお探しのページは、移動または削除された可能性があります。',
    // ulid gen
    'ulidGenTitle': 'ULID生成ツール',
    'ulidGenInputHeading': 'ULID生成条件',
    'ulidGenOutputHeading': '生成結果',
    'isSelectedTimeMode': '基準日時を指定する',
    'baseUnixDatetime': '基準日時(UNIXタイムスタンプ)',
    'baseDate': '基準日',
    'isMonoIncreaseMode': '単調増加',
    'isMonoIncreaseModeHint': 'ULID後部のランダム部分を1ビットずつの増分で生成します。',
    'generate': '生成',
    'generatingSize': '生成数',
    'generatingSizePlaceholder': '最大5,000まで',
    'datetimeMakerDialogTitle': '基準日時の選択',
    'datetimeMakerDialogMessage': '基準日時を入力してください。\n選択された日時はUNIXタイムスタンプへと変換されます。',
    'datetimeMakerDialogErrorRequired': '必須項目です。',
    'datetimeMakerDialogErrorInvalidBaseDate': '正しい基準日を入力してください。例: {0}',
    'datetimeMakerDialogErrorInvalidTime': '正しい時間を入力してください。',
  },
  en: {
    // common
    'guest': 'Guest',
    'goBackHome': 'Back to Home',
    'copyRight': '© 2024 Yutaka Morihara',
    'hours': 'Hours',
    'minutes': 'Minutes',
    'seconds': 'Seconds',
    'ok': 'Ok',
    'cancel': 'Cancel',
    // error
    'notFoundErrorTitle': 'Page not found',
    'notFoundErrorMessage': 'Sorry, the page you\'re looking for can\'t be found.',
    // ulid gen
    'ulidGenTitle': 'ULID Generator',
    'ulidGenInputHeading': 'Conditions',
    'ulidGenOutputHeading': 'Results',
    'isSelectedTimeMode': 'Specify the base datetime',
    'baseUnixDatetime': 'Base datetime - UNIX Timestamp',
    'baseDate': 'Base date',
    'isMonoIncreaseMode': 'Increase monotonically',
    'isMonoIncreaseModeHint': 'The random part at the end of the ULID is generated in increments of 1 bit.',
    'generate': 'Generate',
    'generatingSize': 'Number of ULIDs to generate',
    'generatingSizePlaceholder': 'Max 5,000',
    'datetimeMakerDialogTitle': 'Select Base Datatime',
    'datetimeMakerDialogMessage': 'Please enter the base datetime.\nThe selected datetime will be converted to a UNIX timestamp.',
    'datetimeMakerDialogErrorRequired': 'Required fields are missing.',
    'datetimeMakerDialogErrorInvalidBaseDate': 'Invalid base date. ex) {0}',
    'datetimeMakerDialogErrorInvalidTime': 'Invalid time.',
  }
}
