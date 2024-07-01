/**
 * @format
 */
import 'rn-overlay';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 加载语言文件
i18n.use(initReactI18next) // passes i18n down to react-i18next
.init({
  resources: {
    en: {
      translation: require('./src/locales/en/translation.json'),
    },
    zh: {
      translation: require('./src/locales/zh/translation.json'),
    },
  },
  lng: 'zh', // 默认语言
  fallbackLng: 'zh', // 如果当前选择的语言没有对应翻译，则回退到这个语言
  interpolation: {
    escapeValue: false, 
  },
});
AppRegistry.registerComponent(appName, () => App);
