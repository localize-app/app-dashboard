// src/types/locale.types.ts
export enum LocaleCode {
  EN_US = 'en-US', // English (United States)
  EN_GB = 'en-GB', // English (United Kingdom)
  FR_FR = 'fr-FR', // French (France)
  FR_CA = 'fr-CA', // French (Canada)
  ES_ES = 'es-ES', // Spanish (Spain)
  ES_MX = 'es-MX', // Spanish (Mexico)
  DE_DE = 'de-DE', // German (Germany)
  IT_IT = 'it-IT', // Italian (Italy)
  PT_BR = 'pt-BR', // Portuguese (Brazil)
  PT_PT = 'pt-PT', // Portuguese (Portugal)
  NL_NL = 'nl-NL', // Dutch (Netherlands)
  ZH_CN = 'zh-CN', // Chinese (Simplified)
  ZH_TW = 'zh-TW', // Chinese (Traditional)
  JA_JP = 'ja-JP', // Japanese (Japan)
  KO_KR = 'ko-KR', // Korean (Korea)
  RU_RU = 'ru-RU', // Russian (Russia)
  AR_SA = 'ar-SA', // Arabic (Saudi Arabia)
  HI_IN = 'hi-IN', // Hindi (India)
  PL_PL = 'pl-PL', // Polish (Poland)
  TR_TR = 'tr-TR', // Turkish (Turkey)
  SV_SE = 'sv-SE', // Swedish (Sweden)
  DA_DK = 'da-DK', // Danish (Denmark)
  FI_FI = 'fi-FI', // Finnish (Finland)
  NO_NO = 'no-NO', // Norwegian (Norway)
}

export interface LocaleDetails {
  code: LocaleCode;
  name: string;
  nativeName: string;
  region: string;
  isRtl: boolean;
}

// Map of locale codes to their details
export const localeDetailsMap: Record<LocaleCode, LocaleDetails> = {
  [LocaleCode.EN_US]: {
    code: LocaleCode.EN_US,
    name: 'English',
    nativeName: 'English',
    region: 'United States',
    isRtl: false,
  },
  [LocaleCode.EN_GB]: {
    code: LocaleCode.EN_GB,
    name: 'English',
    nativeName: 'English',
    region: 'United Kingdom',
    isRtl: false,
  },
  [LocaleCode.FR_FR]: {
    code: LocaleCode.FR_FR,
    name: 'French',
    nativeName: 'Français',
    region: 'France',
    isRtl: false,
  },
  [LocaleCode.FR_CA]: {
    code: LocaleCode.FR_CA,
    name: 'French',
    nativeName: 'Français',
    region: 'Canada',
    isRtl: false,
  },
  [LocaleCode.ES_ES]: {
    code: LocaleCode.ES_ES,
    name: 'Spanish',
    nativeName: 'Español',
    region: 'Spain',
    isRtl: false,
  },
  [LocaleCode.ES_MX]: {
    code: LocaleCode.ES_MX,
    name: 'Spanish',
    nativeName: 'Español',
    region: 'Mexico',
    isRtl: false,
  },
  [LocaleCode.DE_DE]: {
    code: LocaleCode.DE_DE,
    name: 'German',
    nativeName: 'Deutsch',
    region: 'Germany',
    isRtl: false,
  },
  [LocaleCode.IT_IT]: {
    code: LocaleCode.IT_IT,
    name: 'Italian',
    nativeName: 'Italiano',
    region: 'Italy',
    isRtl: false,
  },
  [LocaleCode.PT_BR]: {
    code: LocaleCode.PT_BR,
    name: 'Portuguese',
    nativeName: 'Português',
    region: 'Brazil',
    isRtl: false,
  },
  [LocaleCode.PT_PT]: {
    code: LocaleCode.PT_PT,
    name: 'Portuguese',
    nativeName: 'Português',
    region: 'Portugal',
    isRtl: false,
  },
  [LocaleCode.NL_NL]: {
    code: LocaleCode.NL_NL,
    name: 'Dutch',
    nativeName: 'Nederlands',
    region: 'Netherlands',
    isRtl: false,
  },
  [LocaleCode.ZH_CN]: {
    code: LocaleCode.ZH_CN,
    name: 'Chinese',
    nativeName: '简体中文',
    region: 'China',
    isRtl: false,
  },
  [LocaleCode.ZH_TW]: {
    code: LocaleCode.ZH_TW,
    name: 'Chinese',
    nativeName: '繁體中文',
    region: 'Taiwan',
    isRtl: false,
  },
  [LocaleCode.JA_JP]: {
    code: LocaleCode.JA_JP,
    name: 'Japanese',
    nativeName: '日本語',
    region: 'Japan',
    isRtl: false,
  },
  [LocaleCode.KO_KR]: {
    code: LocaleCode.KO_KR,
    name: 'Korean',
    nativeName: '한국어',
    region: 'Korea',
    isRtl: false,
  },
  [LocaleCode.RU_RU]: {
    code: LocaleCode.RU_RU,
    name: 'Russian',
    nativeName: 'Русский',
    region: 'Russia',
    isRtl: false,
  },
  [LocaleCode.AR_SA]: {
    code: LocaleCode.AR_SA,
    name: 'Arabic',
    nativeName: 'العربية',
    region: 'Saudi Arabia',
    isRtl: true,
  },
  [LocaleCode.HI_IN]: {
    code: LocaleCode.HI_IN,
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'India',
    isRtl: false,
  },
  [LocaleCode.PL_PL]: {
    code: LocaleCode.PL_PL,
    name: 'Polish',
    nativeName: 'Polski',
    region: 'Poland',
    isRtl: false,
  },
  [LocaleCode.TR_TR]: {
    code: LocaleCode.TR_TR,
    name: 'Turkish',
    nativeName: 'Türkçe',
    region: 'Turkey',
    isRtl: false,
  },
  [LocaleCode.SV_SE]: {
    code: LocaleCode.SV_SE,
    name: 'Swedish',
    nativeName: 'Svenska',
    region: 'Sweden',
    isRtl: false,
  },
  [LocaleCode.DA_DK]: {
    code: LocaleCode.DA_DK,
    name: 'Danish',
    nativeName: 'Dansk',
    region: 'Denmark',
    isRtl: false,
  },
  [LocaleCode.FI_FI]: {
    code: LocaleCode.FI_FI,
    name: 'Finnish',
    nativeName: 'Suomi',
    region: 'Finland',
    isRtl: false,
  },
  [LocaleCode.NO_NO]: {
    code: LocaleCode.NO_NO,
    name: 'Norwegian',
    nativeName: 'Norsk',
    region: 'Norway',
    isRtl: false,
  },
};

// Helper function to get locale details from code
export function getLocaleDetails(code: LocaleCode): LocaleDetails {
  return (
    localeDetailsMap[code] || {
      code,
      name: code,
      nativeName: code,
      region: '',
      isRtl: false,
    }
  );
}

// Helper function to get formatted locale name with region
export function getFormattedLocaleName(code: LocaleCode): string {
  const details = getLocaleDetails(code);
  return `${details.name} (${details.region})`;
}
