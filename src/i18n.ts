import { createI18n } from 'vue-i18n';
import { Config } from './config';

function loadLocaleMessages() {
  const locales: Record<string, any> = import.meta.glob('@/locales/*.json', {
    eager: true,
  });
  const allowedLanguages = String(Config.SUPPORTED_LANGUAGES).split(',');
  const messages: Record<string, any> = {};

  if (locales) {
    for (const path in locales) {
      const array = path.split('/');
      const lanFile = array[array.length - 1];
      const lanFileName = lanFile.split('.')[0];

      if (allowedLanguages.includes(lanFileName)) {
        Object.assign(messages, { [lanFileName]: locales[path] });
      }
    }
  }
  return messages;
}
export default createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.getItem('locale')
    ? localStorage.getItem('locale')
    : Config.I18N_LOCALE || 'en',
  fallbackLocale: localStorage.getItem('locale')
    ? localStorage.getItem('locale')
    : Config.I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages(),
});
