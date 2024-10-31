import { Locale, Text } from "../text";

export const DEF_TEXT: { [locale in Locale]: Text } = {
  ja: {
    // common
    'guest': 'ゲスト',
    'goBackHome': 'ホームに戻る',
    'copyRight': '© 2024 Yutaka Morihara',
    // error
    'notFoundErrorTitle': 'ページが見つかりません',
    'notFoundErrorMessage': '申し訳ございません。\nお探しのページは、移動または削除された可能性があります。',
  },
  en: {
    // common
    'guest': 'Guest',
    'goBackHome': 'Back to Home',
    'copyRight': '© 2024 Yutaka Morihara',
    // error
    'notFoundErrorTitle': 'Page not found',
    'notFoundErrorMessage': 'Sorry, the page you\'re looking for can\'t be found.',
  }
}
