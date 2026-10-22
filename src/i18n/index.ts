import { useCallback, useMemo } from 'react';
import { useSettings, type Lang } from '../state/settings';
import { de } from './de';
import { en } from './en';

export type MsgKey = keyof typeof de;
export type Translate = (key: MsgKey, vars?: Record<string, string | number>) => string;
export interface I18n {
  t: Translate;
  lang: Lang;
}

const dicts: Record<Lang, Record<MsgKey, string>> = { de, en };

export function useI18n(): I18n {
  const { settings } = useSettings();
  const lang = settings.lang;
  const t = useCallback<Translate>(
    (key, vars) => {
      let s = dicts[lang][key] ?? de[key] ?? key;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
      return s;
    },
    [lang],
  );
  return useMemo(() => ({ t, lang }), [t, lang]);
}
