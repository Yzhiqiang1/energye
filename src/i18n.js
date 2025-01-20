// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json'
import zh from './locales/zh/translation.json'

const resources = {
  en: {
    translation: en
  },
  zh: {
    translation: zh
  }
};

i18n
  .use(initReactI18next) // 将i18next绑定到react上
  .init({
    resources,
    lng: "zh", // 默认语言
    fallbackLng: 'zh', // 如果指定语言的翻译不可用时使用的备用语言
    interpolation: {
      escapeValue: false // 不需要转义HTML
    }
  });

export default i18n;